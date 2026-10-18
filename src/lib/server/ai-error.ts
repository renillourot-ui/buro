import type { NextRequest } from "next/server";
import { AllProvidersFailedError, ConfigError, ProviderError } from "@/lib/ai/errors";
import { jsonError } from "@/lib/server/http";

/**
 * Map internal AI/server failures to clean, honest HTTP responses. Details
 * are logged server-side but never exposed to the browser (no raw provider
 * payloads, no message content).
 */
export function mapAiError(err: unknown, route: string): Response {
  if (err instanceof ConfigError) {
    return jsonError(503, "ai_not_configured", err.message);
  }
  if (err instanceof AllProvidersFailedError) {
    console.error(`[${route}] all providers failed:`, err.details.join(" | "));
    return jsonError(
      502,
      "ai_provider_error",
      "The AI provider chain is temporarily unavailable — all endpoints failed. Please try again in a moment.",
    );
  }
  if (err instanceof ProviderError) {
    console.error(`[${route}] provider error:`, err.providerLabel, err.message);
    if (err.status === 429 || err.status === 402) {
      return jsonError(
        502,
        "ai_rate_limited",
        "The free AI endpoint is out of capacity right now. Please try again in a few minutes.",
      );
    }
    if (err.status != null && err.status >= 500) {
      return jsonError(502, "ai_provider_error", "The AI provider had a temporary problem. Please try again.");
    }
    return jsonError(502, "ai_provider_error", "The AI provider returned an unexpected response. Please try again.");
  }
  const aborted = err instanceof Error && (err.name === "AbortError" || err.name === "TimeoutError");
  if (aborted) {
    return jsonError(504, "upstream_timeout", "The AI provider took too long to respond. Please try again.");
  }
  console.error(`[${route}] unexpected error:`, err);
  return jsonError(500, "internal_error", "Something went wrong inside the server. Please try again.");
}

/** Watchdog + client-disconnect aware signal for upstream provider calls. */
export function upstreamSignal(
  req: NextRequest,
  timeoutMs: number,
): { signal: AbortSignal; isWatchdog: () => boolean; cancel: () => void } {
  const controller = new AbortController();
  let watchdogFired = false;
  const timer = setTimeout(() => {
    watchdogFired = true;
    controller.abort();
  }, timeoutMs);
  timer.unref?.();
  let clientGone = false;
  const onClientAbort = () => {
    clientGone = true;
    controller.abort();
  };
  if (req.signal) {
    if (req.signal.aborted) onClientAbort();
    else req.signal.addEventListener("abort", onClientAbort, { once: true });
  }
  return {
    signal: controller.signal,
    isWatchdog: () => watchdogFired && !clientGone,
    cancel: () => {
      clearTimeout(timer);
      req.signal?.removeEventListener("abort", onClientAbort);
    },
  };
}
