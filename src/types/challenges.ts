import type { ContentLanguage } from "./index";

export type ChallengeDifficulty = "easy" | "medium" | "hard";

/**
 * Deterministic tests run ONLY for JavaScript/TypeScript challenges, and only
 * in the user's own browser, inside a short-lived Web Worker with a timeout.
 * Results are real — never fabricated. Challenges without `tests` are
 * reviewed by the AI and labeled as AI feedback.
 */
export interface ChallengeTest {
  fn: string;
  args: unknown[];
  expected: unknown;
}

export interface Challenge {
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  /** Primary language of the challenge. */
  language: ContentLanguage;
  tags: string[];
  /** GitHub-flavored Markdown problem statement. */
  description: string;
  examples: Array<{ input: string; output: string }>;
  starterCode: string;
  hints: string[];
  tests?: ChallengeTest[];
  /** The name of the function that tests call. */
  entryFunction?: string;
  /** Markdown explanation of an idiomatic solution. */
  solutionApproach: string;
  solutionCode: string;
}
