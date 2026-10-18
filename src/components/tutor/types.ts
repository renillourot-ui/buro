import type { CodeLanguage } from "@/types";

/** Review state for the code workspace (kept in React memory only). */
export interface ReviewState {
  status: "idle" | "loading" | "done" | "error";
  result?: { feedback: string; servedModel?: string };
  error?: string;
}

/** Shared re-exports keep the tutor component module surface tidy. */
export type { CodeLanguage };
