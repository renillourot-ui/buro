import type { ContentLanguage } from "./index";

/** Slugs of the six built-in learning paths. */
export type CourseSlug =
  | "javascript-fundamentals"
  | "typescript-fundamentals"
  | "html-and-css"
  | "python-fundamentals"
  | "react-fundamentals"
  | "nextjs-fundamentals";

export interface LessonSection {
  heading: string;
  /** GitHub-flavored Markdown. Avoid H1/H2 inside bodies — the page provides headings. */
  body: string;
}

export interface LineNote {
  /** The (short) code chunk the note explains. */
  code: string;
  note: string;
}

export interface CodeExample {
  title: string;
  /** One-two sentence framing, optional. */
  description?: string;
  language: ContentLanguage;
  code: string;
  /** Optional line-by-line walkthrough, aligned with code order. */
  lineNotes?: LineNote[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface CommonMistake {
  wrong: string;
  why: string;
  fix: string;
}

export interface LessonExercise {
  title: string;
  prompt: string;
  language?: ContentLanguage;
  starterCode?: string;
  hint: string;
}

export interface Lesson {
  /** URL slug, e.g. "variables-and-constants". */
  slug: string;
  title: string;
  minutes: number;
  objectives: string[];
  sections: LessonSection[];
  examples: CodeExample[];
  mistakes: CommonMistake[];
  quiz: QuizQuestion[];
  exercises: LessonExercise[];
}

export interface Course {
  slug: CourseSlug;
  title: string;
  tagline: string;
  description: string;
  difficulty: "beginner" | "intermediate";
  /** Accent color used to differentiate path cards. */
  accent: string;
  lessons: Lesson[];
}

export const COURSE_INDEXES: Record<CourseSlug, number> = {
  "javascript-fundamentals": 0,
  "typescript-fundamentals": 1,
  "html-and-css": 2,
  "python-fundamentals": 3,
  "react-fundamentals": 4,
  "nextjs-fundamentals": 5,
};
