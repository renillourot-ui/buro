/**
 * Provider configuration — the TypeScript port of the chain in the bundled
 * reference client `ai_client.py`:
 *
 *   1. Vireonix   https://vireonix.ai/v1         model "auto"          (keyless)
 *   2. Murakumo   https://api.murakumo.cloud/v1  model "murakumo/free" (keyless, 2048-token cap)
 *   3. Murakumo   https://api.murakumo.cloud/v1  model "mishima"
 *
 * The default chain is keyless and requires no credentials. A custom
 * OpenAI-compatible provider may be configured through environment
 * variables instead; its key stays server-side at all times.
 */

import { ConfigError } from "./errors";

export interface ProviderConfig {
  id: string;
  label: string;
  baseUrl: string;
  model: string;
  apiKey?: string;
  /** Public Murakumo route hard-caps completion length. */
  maxTokensCap?: number;
  /** Murakumo's cold starts are retried once with back-off (mirrors ai_client.py). */
  retries: number;
}

export const FREE_PROVIDERS: ProviderConfig[] = [
  {
    id: "vireonix",
    label: "Vireonix",
    baseUrl: "https://vireonix.ai/v1",
    model: "auto",
    retries: 0,
  },
  {
    id: "murakumo-free",
    label: "Murakumo free lane",
    baseUrl: "https://api.murakumo.cloud/v1",
    model: "murakumo/free",
    maxTokensCap: 2048,
    retries: 1,
  },
  {
    id: "murakumo-mishima",
    label: "Murakumo mishima",
    baseUrl: "https://api.murakumo.cloud/v1",
    model: "mishima",
    maxTokensCap: 2048,
    retries: 1,
  },
];

export type ResolvedProviders =
  | { mode: "free-chain"; providers: ProviderConfig[] }
  | { mode: "pinned"; providers: [ProviderConfig] }
  | { mode: "custom"; providers: [ProviderConfig] };

function buildCustomProvider(): ProviderConfig | null {
  const baseUrl = process.env.AI_BASE_URL?.trim();
  const model = process.env.AI_MODEL?.trim();
  const apiKey = process.env.AI_API_KEY?.trim();
  const keyless = process.env.AI_KEYLESS === "1";
  if (!baseUrl && !apiKey && !model) return null;
  if (!baseUrl || !model) {
    throw new ConfigError(
      "AI provider configuration is incomplete. When using a custom provider, set AI_BASE_URL and AI_MODEL (and AI_API_KEY for keyed providers) in .env.local, then restart the server.",
    );
  }
  if (!apiKey && !keyless) {
    throw new ConfigError(
      "AI provider configuration is incomplete: AI_API_KEY is required when using a custom provider. Add AI_API_KEY=your_key to .env.local (never NEXT_PUBLIC_), then restart the server. For genuinely keyless local endpoints, set AI_KEYLESS=1 to acknowledge it.",
    );
  }
  return {
    id: "custom",
    label: "Custom provider",
    baseUrl,
    model,
    apiKey: apiKey || undefined,
    retries: 0,
  };
}

/**
 * Resolve the provider list once per request. Throws ConfigError when custom
 * configuration is present but incomplete — routes translate that into a 503
 * configuration error (never a fabricated AI response).
 */
export function resolveProviders(): ResolvedProviders {
  const custom = buildCustomProvider();
  if (custom) return { mode: "custom", providers: [custom] };

  const pin = process.env.AI_PROVIDER?.trim().toLowerCase();
  if (pin && pin !== "auto") {
    const pinned = FREE_PROVIDERS.find((p) => p.id === pin);
    if (!pinned) {
      throw new ConfigError(
        `AI_PROVIDER="${pin}" is not a valid provider pin. Use: vireonix | murakumo-free | murakumo-mishima | custom.`,
      );
    }
    return { mode: "pinned", providers: [pinned] };
  }
  return { mode: "free-chain", providers: FREE_PROVIDERS };
}

export function clampTokens(provider: ProviderConfig, maxTokens: number): number {
  if (provider.maxTokensCap) return Math.min(maxTokens, provider.maxTokensCap);
  return maxTokens;
}
