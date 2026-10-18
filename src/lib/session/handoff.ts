/**
 * Ephemeral, in-memory handoff for features that navigate INTO the tutor
 * (debugging assistant → tutor workspace, challenge → tutor, lesson → tutor).
 *
 * This is deliberately NOT persistence: it is a single module variable that
 * is consumed and immediately cleared on first read. It never touches
 * localStorage, cookies or the URL, and a full page refresh clears it with
 * the rest of the JS module scope.
 */

export interface CodeHandoff {
  kind: "code";
  language: TutorLanguageLite;
  code: string;
  /** Optional question to prefill into the chat input. */
  question?: string;
}

type TutorLanguageLite = "javascript" | "typescript" | "python" | "html" | "css" | "general";

let pending: CodeHandoff | null = null;

export function setCodeHandoff(value: CodeHandoff): void {
  pending = { ...value };
}

export function takeCodeHandoff(): CodeHandoff | null {
  const value = pending;
  pending = null;
  return value;
}
