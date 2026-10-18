import type { OpenAIMessage } from "./providers/openai-compatible";

/** Configuration missing or invalid — surfaced as HTTP 503, never as fake output. */
export class ConfigError extends Error {
  readonly code = "ai_not_configured";
}

/** The upstream AI provider failed — surfaced as HTTP 502 with a readable message. */
export class ProviderError extends Error {
  readonly code = "ai_provider_error";
  constructor(
    message: string,
    readonly providerLabel: string,
    readonly status?: number,
    readonly detail?: string,
  ) {
    super(message);
  }
}

export class AllProvidersFailedError extends Error {
  readonly code = "ai_provider_error";
  constructor(readonly details: string[]) {
    super("The AI provider chain could not complete this request.");
  }
}

/** Compact OpenAI-style wire message. */
export type { OpenAIMessage };
