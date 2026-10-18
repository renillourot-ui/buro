/**
 * Best-effort in-memory fixed-window rate limiter.
 *
 * LIMITATION (documented in README): this limiter lives in a single process.
 * On serverless/multi-instance deployments each instance counts separately,
 * so treat these as gentle abuse guards, not precise global quotas. For hard
 * guarantees use an external limit store (e.g. Upstash Redis) — that is an
 * infrastructure choice, this app needs no database of its own.
 */

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();
const MAX_TRACKED = 5000;

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  if (process.env.RATE_LIMIT_DISABLED === "1") {
    return { ok: true, remaining: limit, retryAfterSec: 0 };
  }
  const now = Date.now();
  let entry = buckets.get(key);
  if (!entry || entry.resetAt <= now) {
    if (buckets.size > MAX_TRACKED) prune(now);
    entry = { count: 0, resetAt: now + windowMs };
    buckets.set(key, entry);
  }
  entry.count += 1;
  const ok = entry.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSec: ok ? 0 : Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

function prune(now: number): void {
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}
