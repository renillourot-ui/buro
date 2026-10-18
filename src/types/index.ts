/**
 * Shared application types. CodeMentor AI keeps all application state in
 * React memory — these types describe the shape of that in-memory state.
 */

/** Languages available in the code editor. */
export type CodeLanguage = "javascript" | "typescript" | "python" | "html" | "css";

/** TSX is only used for lesson/challenge content; it renders as TypeScript. */
export type ContentLanguage = CodeLanguage | "tsx";

/** Languages accepted by the tutor context (includes a general option). */
export type TutorLanguage = CodeLanguage | "general";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type TutorMode = "learn" | "debug" | "challenge";

/** A chat message as it exists in React state (never persisted anywhere). */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  status: "pending" | "streaming" | "done" | "stopped" | "error";
  /** Failed request description; present only when status === "error". */
  error?: string;
  /** Which model actually served the answer, when the provider reports it. */
  servedModel?: string;
}

/** Payload sent to POST /api/tutor/chat — built from current React state. */
export interface ChatRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  language: TutorLanguage;
  level: SkillLevel;
  mode: TutorMode;
  beginner: boolean;
}

/** Language metadata used by selectors, templates and follow-up prompts. */
export interface LanguageMeta {
  id: TutorLanguage;
  label: string;
  /** Monaco editor language id. */
  monaco: CodeLanguage;
  /** highlight.js / markdown fence id. */
  hljs: string;
  accent: string;
  tagline: string;
}

export const LANGUAGES: LanguageMeta[] = [
  {
    id: "javascript",
    label: "JavaScript",
    monaco: "javascript",
    hljs: "javascript",
    accent: "#f7df1e",
    tagline: "The language of the web — logic, the DOM and async flows.",
  },
  {
    id: "typescript",
    label: "TypeScript",
    monaco: "typescript",
    hljs: "typescript",
    accent: "#7389ff",
    tagline: "JavaScript with a type system that scales with your project.",
  },
  {
    id: "python",
    label: "Python",
    monaco: "python",
    hljs: "python",
    accent: "#3fd5cc",
    tagline: "Readable and powerful — a great first language, from automation to data work.",
  },
  {
    id: "html",
    label: "HTML",
    monaco: "html",
    hljs: "xml",
    accent: "#ff7b54",
    tagline: "Structure every page — elements, semantics and accessibility.",
  },
  {
    id: "css",
    label: "CSS",
    monaco: "css",
    hljs: "css",
    accent: "#9f7bff",
    tagline: "Style and layout — selectors, flexbox, grid and responsive design.",
  },
  {
    id: "general",
    label: "General",
    monaco: "javascript",
    hljs: "plaintext",
    accent: "#8a93a8",
    tagline: "Concepts, tools and career questions across all languages.",
  },
];

export function languageMeta(id: TutorLanguage): LanguageMeta {
  return LANGUAGES.find((l) => l.id === id) ?? LANGUAGES[LANGUAGES.length - 1]!;
}

export function monacoLanguage(id: TutorLanguage): CodeLanguage {
  return languageMeta(id).monaco;
}
