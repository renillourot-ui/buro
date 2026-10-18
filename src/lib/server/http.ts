import type { NextRequest } from "next/server";
import type { z } from "zod";

/** Uniform error envelope: { error: { code, message } }. Never leaks internals. */
export function jsonError(
  status: number,
  code: string,
  message: string,
  headers?: HeadersInit,
): Response {
  return Response.json({ error: { code, message } }, { status, headers });
}

export interface ParsedBody<T> {
  ok: true;
  data: T;
}

export interface ParseFailure {
  ok: false;
  error: Response;
}

/** Parse a JSON body with strict caps (20 messages × 8 000 + overhead). */
export async function readJsonBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T,
  maxBytes = 180_000,
): Promise<ParsedBody<z.output<T>> | ParseFailure> {
  // Reject oversized uploads by declared size first — never buffer a huge body
  // just to throw it away (also protects against pathological body handling).
  const tooLarge = () =>
    jsonError(413, "too_large", "The request body is too large. Trim the code or trim the question and retry.");
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, error: tooLarge() };
  }
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { ok: false, error: jsonError(400, "bad_request", "Could not read the request body.") };
  }
  if (raw.length > maxBytes) {
    return { ok: false, error: tooLarge() };
  }
  let candidate: unknown;
  try {
    candidate = JSON.parse(raw);
  } catch {
    return { ok: false, error: jsonError(400, "bad_json", "The request body is not valid JSON.") };
  }
  const parsed = schema.safeParse(candidate);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const path = issue?.path?.length ? `${issue.path.join(".")}: ` : "";
    const message = issue ? `${path}${issue.message}` : "Invalid request.";
    return { ok: false, error: jsonError(400, "invalid_request", message) };
  }
  return { ok: true, data: parsed.data };
}

/** First forwarded IP, or a stable local placeholder. */
export function clientKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  return "local";
}

/** Combine the client's signal with a server-side watchdog. */
export function requestSignal(req: NextRequest, timeoutMs: number): AbortController {
  const controller = new AbortController();
  const abort = () => controller.abort();
  setTimeout(abort, timeoutMs).unref?.();
  req.signal?.addEventListener("abort", abort, { once: true });
  return controller;
}
