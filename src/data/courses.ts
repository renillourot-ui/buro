import { javascriptLessons } from "./lessons/javascript";
import type { Course, CourseSlug, Lesson } from "@/types/course";
import { typescriptLessons } from "./lessons/typescript";
import { htmlCssLessons } from "./lessons/html-css";
import { pythonLessons } from "./lessons/python";
import { reactLessons } from "./lessons/react";
import { nextJsLessons } from "./lessons/nextjs";

/** The six static learning paths. Content ships with the project — no DB. */
export const COURSES: Course[] = [
  {
    slug: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    tagline: "Logic, the DOM and async JavaScript.",
    description:
      "Start from zero and build real fluency: values, control flow, functions, arrays and objects, the DOM, and asynchronous patterns that everything else builds on.",
    difficulty: "beginner",
    accent: "#f7df1e",
    lessons: javascriptLessons,
  },
  {
    slug: "typescript-fundamentals",
    title: "TypeScript Fundamentals",
    tagline: "JavaScript gains a type system.",
    description:
      "Learn to think in types: annotations, unions, interfaces and generics — and how a sound type system catches bugs before you run the code.",
    difficulty: "beginner",
    accent: "#7389ff",
    lessons: typescriptLessons,
  },
  {
    slug: "html-and-css",
    title: "HTML and CSS",
    tagline: "Structure and style real pages.",
    description:
      "From a first document to flexbox, grid and responsive layouts — the foundation every web project is built on, taught with semantics and accessibility in mind.",
    difficulty: "beginner",
    accent: "#ff7b54",
    lessons: htmlCssLessons,
  },
  {
    slug: "python-fundamentals",
    title: "Python Fundamentals",
    tagline: "Readable code, powerful results.",
    description:
      "A gentle but complete tour of Python 3: types, control flow, collections, comprehensions, exceptions, files and the standard library.",
    difficulty: "beginner",
    accent: "#3fd5cc",
    lessons: pythonLessons,
  },
  {
    slug: "react-fundamentals",
    title: "React Fundamentals",
    tagline: "Think in components and state.",
    description:
      "Components, JSX, props, state and effects — build the mental model that makes React codebases readable and predictable.",
    difficulty: "intermediate",
    accent: "#7dd3fc",
    lessons: reactLessons,
  },
  {
    slug: "nextjs-fundamentals",
    title: "Next.js Fundamentals",
    tagline: "The full framework around React.",
    description:
      "File-based routing, server and client components, layouts, data fetching and route handlers — how this very project is built.",
    difficulty: "intermediate",
    accent: "#a78bfa",
    lessons: nextJsLessons,
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === (slug as CourseSlug));
}

export function getLessonIndex(course: Course, lessonSlug: string): number {
  return course.lessons.findIndex((lesson) => lesson.slug === lessonSlug);
}

export function getLesson(course: Course, lessonSlug: string): { lesson: Lesson; index: number } | undefined {
  const index = getLessonIndex(course, lessonSlug);
  const lesson = index >= 0 ? course.lessons[index] : undefined;
  return lesson ? { lesson, index } : undefined;
}

export function lessonHref(courseSlug: CourseSlug | string, lessonSlug: string): string {
  return `/learn/${courseSlug}/${lessonSlug}`;
}
