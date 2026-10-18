/**
 * Wire-level client for OpenAI-compatible chat endpoints, mirroring the
 * HTTP behavior of the bundled reference client `ai_client.py`:
 *
 * - requests are keyless by default (Authorization only when a key exists)
 * - a plain browser-like User-Agent is required (urllib's default gets 403'd)
 * - Murakumo announces the model that actually answered via the
 *   `x-murakumo-served-model` header — read it instead of trusting the request
 * - routed models sometimes place the draft in `reasoning` instead of
 *   `content` — fall back before treating a response as empty
 */

import { ProviderError } from "../errors";

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIChatOptions {
  baseUrl: string;
  model: string;
  apiKey?: string;
  messages: OpenAIMessage[];
  maxTokens?: number;
  temperature?: number;
  signal: AbortSignal;
  /** Receives the model that actually served the response, when known. */
  onServedModel?: (servedModel: string) => void;
}

export interface OpenAIReply {
  text: string;
  servedModel: string;
}

/** Some endpoint filters reject non-browser user agents; keep the proven value. */
const USER_AGENT = "Mozilla/5.0";

function wireBody(opts: OpenAIChatOptions, stream: boolean): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
  };
  if (opts.maxTokens != null) body.max_tokens = opts.maxTokens;
  if (opts.temperature != null) body.temperature = opts.temperature;
  if (stream) body.stream = true;
  return body;
}

function wireHeaders(opts: OpenAIChatOptions, stream: boolean): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": USER_AGENT,
  };
  if (stream) {
    headers.Accept = "text/event-stream";
  }
  if (opts.apiKey) {
    headers.Authorization = `Bearer ${opts.apiKey}`;
  }
  return headers;
}

async function raiseForStatus(
  res: Response,
  providerLabel: string,
): Promise<never> {
  let detail = "";
  try {
    detail = (await res.text()).slice(0, 300);
  } catch {
    // ignore body read failures — status is enough
  }
  throw new ProviderError(
    `Provider ${providerLabel} responded with HTTP ${res.status}.`,
    providerLabel,
    res.status,
    detail,
  );
}

/** Extract assistant text; routed models may put the draft in `reasoning`. */
function extractText(choice: unknown): string {
  const c = choice as { message?: { content?: unknown; reasoning?: unknown } } | undefined;
  const msg = c?.message;
  if (typeof msg?.content === "string" && msg.content.length > 0) return msg.content;
  if (typeof msg?.reasoning === "string" && msg.reasoning.length > 0) return msg.reasoning;
  return "";
}

function servedFromHeaders(res: Response, bodyModel?: string): string {
  const header =
    res.headers.get("x-murakumo-served-model") ??
    res.headers.get("x-served-model") ??
    "";
  return header || bodyModel || "";
}

/* -------------------------------------------------------------------------- */
/* Non-streaming completion                                                    */
/* -------------------------------------------------------------------------- */

export async function openAIComplete(opts: OpenAIChatOptions): Promise<OpenAIReply> {
  const res = await fetch(`${opts.baseUrl}/chat/completions`, {
    method: "POST",
    headers: wireHeaders(opts, false),
    body: JSON.stringify(wireBody(opts, false)),
    signal: opts.signal,
    cache: "no-store",
  });
  if (!res.ok) await raiseForStatus(res, opts.model);
  if (!res.body) {
    throw new ProviderError(
      "Provider returned an empty response body.",
      opts.model,
      res.status,
    );
  }

  const out = (await res.json().catch(() => null)) as
    | {
        model?: string;
        choices?: Array<{ message?: unknown }>;
        error?: unknown;
      }
    | null;

  if (out?.error) {
    throw new ProviderError(
      "Provider reported an error in its response payload.",
      opts.model,
      res.status,
      JSON.stringify(out.error).slice(0, 300),
    );
  }

  const choice = out?.choices?.[0];
  const text = choice ? extractText(choice) : "";
  if (!text.trim()) {
    throw new ProviderError(
      "Provider returned an empty completion.",
      opts.model,
      res.status,
    );
  }

  const servedModel = servedFromHeaders(res, out?.model ?? opts.model);
  opts.onServedModel?.(servedModel);
  return { text, servedModel };
}

/* -------------------------------------------------------------------------- */
/* Streaming completion (OpenAI-style SSE)                                     */
/* -------------------------------------------------------------------------- */

/**
 * Yields text deltas parsed from the provider's SSE stream. Throws
 * ProviderError if the stream ends without any content chunk (mirrors
 * `_stream_sse` in ai_client.py, so callers can fall through the chain).
 */
export async function* openAIStream(opts: OpenAIChatOptions): AsyncGenerator<string> {
  const res = await fetch(`${opts.baseUrl}/chat/completions`, {
    method: "POST",
    headers: wireHeaders(opts, true),
    body: JSON.stringify(wireBody(opts, true)),
    signal: opts.signal,
    cache: "no-store",
  });
  if (!res.ok) await raiseForStatus(res, opts.model);
  if (!res.body) {
    throw new ProviderError(
      "Provider returned an empty stream.",
      opts.model,
      res.status,
    );
  }

  opts.onServedModel?.(servedFromHeaders(res, opts.model));

  const decoder = new TextDecoder();
  const reader = res.body.getReader();
  let buffer = "";
  let yielded = 0;

  const handleLine = (line: string): string | null => {
    if (!line.startsWith("data:")) return null;
    const payload = line.slice(5).trim();
    if (!payload || payload === "[DONE]") return null;
    type WireChunk = {
      error?: unknown;
      choices?: Array<{ delta?: { content?: unknown }; finish_reason?: unknown }>;
    };
    let chunk: WireChunk;
    try {
      chunk = JSON.parse(payload) as WireChunk;
    } catch {
      return null;
    }
    if (chunk.error) {
      throw new ProviderError(
        "Provider reported an error mid-stream.",
        opts.model,
        res.status,
        JSON.stringify(chunk.error).slice(0, 300),
      );
    }
    const delta = chunk.choices?.[0]?.delta;
    const piece = typeof delta?.content === "string" ? delta.content : "";
    return piece || null;
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let nl: number;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).replace(/\r$/, "").trim();
        buffer = buffer.slice(nl + 1);
        const piece = handleLine(line);
        if (piece) {
          yielded += 1;
          yield piece;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (yielded === 0) {
    throw new ProviderError(
      "Provider stream ended without producing any content.",
      opts.model,
      res.status,
    );
  }
}
