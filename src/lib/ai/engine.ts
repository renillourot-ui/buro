import { ConfigError, ProviderError, AllProvidersFailedError } from "./errors";
import { clampTokens, resolveProviders, type ProviderConfig } from "./config";
import {
  openAIComplete,
  openAIStream,
  type OpenAIMessage,
  type OpenAIChatOptions,
} from "./providers/openai-compatible";

export type { OpenAIMessage };

export interface EngineRequest {
  /** Full message list — system prompt always first. Built fresh per request. */
  messages: OpenAIMessage[];
  maxTokens: number;
  temperature: number;
  /** Aborted on client disconnect or watchdog timeout. */
  signal: AbortSignal;
}

export interface EngineReply {
  text: string;
  provider: string;
  servedModel: string;
}

export interface EngineStreamResult {
  /** Async generator of YIELDABLE text deltas. */
  chunks: AsyncGenerator<string>;
  /** Mutable meta — filled as the successful provider streams. */
  meta: { provider: string; servedModel: string };
}

function chatOptions(
  provider: ProviderConfig,
  req: EngineRequest,
  onServedModel?: (m: string) => void,
): OpenAIChatOptions {
  return {
    baseUrl: provider.baseUrl,
    model: provider.model,
    apiKey: provider.apiKey,
    messages: req.messages,
    maxTokens: clampTokens(provider, req.maxTokens),
    temperature: req.temperature,
    signal: req.signal,
    onServedModel,
  };
}

function isAbort(err: unknown): boolean {
  return err instanceof Error && err.name === "AbortError";
}

const sleepMs = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/**
 * Non-streaming completion across the provider chain (mirrors `ask()` in
 * ai_client.py): try providers in order; Murakumo-style providers retry once
 * with short back-off; empty completions count as failures.
 */
export async function generateCompletion(req: EngineRequest): Promise<EngineReply> {
  const { providers } = resolveProviders();
  const details: string[] = [];

  for (const provider of providers) {
    const attempts = 1 + provider.retries;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        let servedModel = provider.model;
        const opts = chatOptions(provider, req, (m) => {
          servedModel = m;
        });
        const { text } = await openAIComplete(opts);
        if (!text.trim()) throw new ProviderError("Empty completion.", provider.label);
        return { text, provider: provider.label, servedModel };
      } catch (err) {
        if (isAbort(err)) throw err;
        const label = `${provider.label}/${provider.model}`;
        const message = err instanceof Error ? err.message : String(err);
        details.push(`${label}: ${message}`);
        const backoffMs = 1600 * (attempt + 1);
        if (err instanceof ConfigError) throw err;
        if (err instanceof ProviderError && provider.retries > 0 && attempt < attempts - 1) {
          await sleepUntilSignal(backoffMs, req.signal);
        }
      }
    }
  }
  logProviderFailures(details);
  throw new AllProvidersFailedError(details);
}

/**
 * Resolve a streaming reply across the provider chain (mirrors `stream()` in
 * ai_client.py): the first provider that yields at least one content chunk
 * wins; a provider that fails before yielding anything falls through. After
 * the first chunk the stream is committed to that provider — a mid-stream
 * failure ends the stream (the client surfaces a retryable error).
 */
export async function startReplyStream(req: EngineRequest): Promise<EngineStreamResult> {
  const { providers } = resolveProviders();
  const details: string[] = [];
  const meta = { provider: "", servedModel: "" };

  for (const provider of providers) {
    try {
      let servedModel = provider.model;
      const inner = openAIStream(chatOptions(provider, req, (m) => {
        servedModel = m;
      }));
      const first = await inner.next();
      const buffered = first.done ? [] : [first.value as unknown as string];
      const source = inner;

      async function* committed(): AsyncGenerator<string> {
        for (const piece of buffered) yield piece;
        yield* source;
      }

      meta.provider = provider.label;
      meta.servedModel = servedModel;
      return { chunks: committed(), meta };
    } catch (err) {
      if (isAbort(err)) throw err;
      const label = `${provider.label}/${provider.model}`;
      const message = err instanceof Error ? err.message : String(err);
      details.push(`${label}: ${message}`);
    }
  }
  logProviderFailures(details);
  throw new AllProvidersFailedError(details);
}

async function sleepUntilSignal(ms: number, signal: AbortSignal): Promise<void> {
  try {
    await sleepMs(ms);
  } catch {
    // ignore — the abort will surface on the next provider call
  }
  signal.throwIfAborted();
}

/** Log provider failures without ever logging message content. */
function logProviderFailures(details: string[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[codementor-ai] provider chain failed: ${details.join(" | ")}`);
  }
}
