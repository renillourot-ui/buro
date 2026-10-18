import type { NextRequest } from "next/server";
import { startReplyStream } from "@/lib/ai/engine";
import { buildTutorSystemPrompt } from "@/lib/ai/system-prompts";
import { mapAiError, upstreamSignal } from "@/lib/server/ai-error";
import { clientKey, jsonError, readJsonBody } from "@/lib/server/http";
import { chatRequestSchema } from "@/lib/validations/schemas";
import { rateLimit } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Vercel-style hint; harmless on self-hosted runs. No database or history here. */
export const maxDuration = 300;

const RATE = { limit: 12, windowMs: 5 * 60_000 };
const WATCHDOG_MS = Number(process.env.AI_TIMEOUT_MS) || 120_000;
const MAX_TOKENS = Number(process.env.CHAT_MAX_TOKENS) || 1600;
const TEMPERATURE = 0.35;

const encoder = new TextEncoder();
const frame = (payload: Record<string, unknown>): Uint8Array =>
  encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);

/**
 * POST /api/tutor/chat — streaming tutor endpoint.
 *
 * Stateless by design: the caller sends the current conversation (from React
 * state) in every request; the server keeps no history, writes nothing, and
 * logs no message content.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const limit = rateLimit({ key: `chat:${clientKey(req)}`, ...RATE });
  if (!limit.ok) {
    return jsonError(
      429,
      "rate_limited",
      "Too many tutor requests — please slow down a little and retry shortly.",
      { "Retry-After": String(limit.retryAfterSec) },
    );
  }

  const body = await readJsonBody(req, chatRequestSchema);
  if (!body.ok) return body.error;

  const { messages, language, level, mode, beginner } = body.data;
  const chatMessages = [
    { role: "system" as const, content: buildTutorSystemPrompt({ language, level, mode, beginner }) },
    ...messages,
  ];

  const upstream = upstreamSignal(req, WATCHDOG_MS);
  let streamResult: Awaited<ReturnType<typeof startReplyStream>>;
  try {
    streamResult = await startReplyStream({
      messages: chatMessages,
      maxTokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      signal: upstream.signal,
    });
  } catch (err) {
    upstream.cancel();
    if (err instanceof Error && err.name === "AbortError") {
      return upstream.isWatchdog()
        ? jsonError(504, "upstream_timeout", "The AI provider took too long to respond. Please try again.")
        : jsonError(499, "client_aborted", "The request was cancelled.");
    }
    return mapAiError(err, "tutor/chat");
  }

  // Provider is up and streaming: commit to a 200 event stream.
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (payload: Record<string, unknown>): void => {
        if (!closed) {
          controller.enqueue(frame(payload));
        }
      };
      try {
        for await (const delta of streamResult.chunks) {
          if (delta) send({ type: "delta", text: delta });
        }
        send({
          type: "done",
          provider: streamResult.meta.provider,
          model: streamResult.meta.servedModel,
        });
      } catch (err) {
        // Mid-stream failure: tell the client honestly so it can offer Retry.
        if (!(err instanceof Error && err.name === "AbortError")) {
          send({
            type: "error",
            message:
              "The AI response was cut off mid-stream. Partial output is shown — press Retry for a full answer.",
          });
          console.error("[tutor/chat] stream interrupted:", err instanceof Error ? err.message : err);
        }
      } finally {
        closed = true;
        upstream.cancel();
        controller.close();
      }
    },
    cancel() {
      // Client disconnected or New Chat pressed: stop upstream generation.
      upstream.cancel();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

/** Cheap health/liveness probe for the route (no AI call, holds no state). */
export async function GET(): Promise<Response> {
  return jsonError(405, "method_not_allowed", "Use POST to talk to the tutor.");
}
