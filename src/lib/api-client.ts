/**
 * Client → API helpers for the tutor, reviewer and debugger. All failures are
 * reported to the caller as typed errors — claims of success are only ever
 * produced by real provider responses, never fabricated client-side.
 */

import type { ChatRequest, SkillLevel, TutorLanguage } from "@/types";

export class ApiError extends Error {
  constructor(message: string, readonly code: string, readonly status: number) {
    super(message);
  }
}

const STATUS_TEXT: Record<number, string> = {
  400: "The request was rejected as invalid.",
  404: "The API route was not found.",
  413: "The request is too large.",
  429: "Too many requests — please wait a moment and try again.",
  500: "Something went wrong on the server.",
  503: "The AI backend is not configured. Set AI_BASE_URL/AI_API_KEY/AI_MODEL in .env.local — see README.",
  504: "The AI provider timed out.",
};

async function raiseError(res: Response): Promise<never> {
  let code = "request_failed";
  let message = STATUS_TEXT[res.status] ?? `The request failed (HTTP ${res.status}).`;
  try {
    const body = (await res.json()) as { error?: { code?: string; message?: string } };
    if (body?.error?.message) message = body.error.message;
    if (body?.error?.code) code = body.error.code;
  } catch {
    // non-JSON error body — keep the status-text fallback
  }
  throw new ApiError(message, code, res.status);
}

export function networkError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (err instanceof DOMException && err.name === "AbortError") {
    return new ApiError("The request was stopped.", "aborted", 499);
  }
  return new ApiError(
    "Network error — could not reach the AI backend. Check your connection and try again.",
    "network_error",
    0,
  );
}

/**
 * POST a streaming chat request. Frames follow the mini-SSE protocol emitted
 * by /api/tutor/chat: {"type":"delta"|"done"|"error"}.
 */
export async function streamChat(
  body: ChatRequest,
  signal: AbortSignal,
  onDelta: (text: string) => void,
): Promise<{ provider?: string; model?: string }> {
  let res: Response;
  try {
    res = await fetch("/api/tutor/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal,
      cache: "no-store",
    });
  } catch (err) {
    throw networkError(err);
  }
  if (!res.ok) {
    await raiseError(res).catch((e) => {
      throw e;
    });
  }
  if (!res.body) {
    throw new ApiError("The server returned an empty stream.", "empty_stream", 502);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  const meta: { provider?: string; model?: string } = {};
  let upstreamError: ApiError | null = null;

  const handleFrame = (raw: string): void => {
    if (!raw.startsWith("data:")) return;
    try {
      const frame = JSON.parse(raw.slice(5).trim()) as {
        type: "delta" | "done" | "error";
        text?: string;
        provider?: string;
        model?: string;
        message?: string;
      };
      if (frame.type === "delta" && frame.text) onDelta(frame.text);
      if (frame.type === "done") {
        meta.provider = frame.provider;
        meta.model = frame.model;
      }
      if (frame.type === "error") {
        upstreamError = new ApiError(frame.message ?? "The AI stream failed.", "provider_error", 502);
      }
    } catch {
      // malformed frame — ignore
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let sep: number;
      while ((sep = buffer.indexOf("\n\n")) >= 0) {
        const block = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        block.split("\n").forEach((line) => {
          if (line.trim()) handleFrame(line);
        });
      }
    }
  } catch (err) {
    throw networkError(err);
  } finally {
    reader.releaseLock();
  }

  if (upstreamError) throw upstreamError;
  return meta;
}

export interface AnalysisResult {
  feedback: string;
  servedModel?: string;
}

interface ReviewPayload {
  code: string;
  language: string;
  level: SkillLevel;
  question?: string;
}

interface AnalyzePayload extends ReviewPayload {
  errorMessage: string;
  expected: string;
  actual: string;
}

/** Non-streaming endpoints (code review / error analysis). */
export async function postAnalysis(
  url: string,
  payload: ReviewPayload | AnalyzePayload,
  signal: AbortSignal,
): Promise<AnalysisResult> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
      cache: "no-store",
    });
  } catch (err) {
    throw networkError(err);
  }
  if (!res.ok) await raiseError(res);
  try {
    const data = (await res.json()) as { feedback: string; servedModel?: string };
    if (typeof data.feedback !== "string" || !data.feedback.trim()) {
      throw new ApiError("The AI returned an empty analysis.", "empty_response", 502);
    }
    return data;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError("Could not read the AI response.", "bad_response", 502);
  }
}

export interface ChatContext {
  language: TutorLanguage;
  level: SkillLevel;
  mode: "learn" | "debug" | "challenge";
  beginner: boolean;
}

export function chatPayload(
  history: Array<{ role: "user" | "assistant"; content: string }>,
  lastMessage: string,
  ctx: ChatContext,
): ChatRequest {
  return {
    messages: [...history, { role: "user" as const, content: lastMessage }].slice(-20),
    language: ctx.language,
    level: ctx.level,
    mode: ctx.mode,
    beginner: ctx.beginner,
  };
}
