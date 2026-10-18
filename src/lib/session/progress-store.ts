/**
 * Session-only progress store. Lives in a client-side module — survives
 * client-side navigation between pages, but resets completely when the page
 * is refreshed or closed because the JS module scope is discarded.
 *
 * This is the ONLY progress tracking the app has: there is no database and
 * no browser storage, and /progress labels all data "session-only".
 */

import type { CourseSlug } from "@/types/course";

export type ActivityType =
  | "lesson"
  | "challenge"
  | "chat"
  | "review"
  | "debug";

export interface ActivityEvent {
  id: number;
  type: ActivityType;
  label: string;
  detail?: string;
  at: number;
}

export interface LessonProgress {
  courseSlug: CourseSlug;
  lessonSlug: string;
  lessonTitle: string;
  courseTitle: string;
  completedAt: number;
}

export interface ChallengeProgress {
  slug: string;
  title: string;
  attempts: number;
  firstAttemptAt: number;
  lastStatus: "attempted" | "tests-passed";
  lastAt: number;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>; // key: `${courseSlug}/${lessonSlug}`
  challenges: Record<string, ChallengeProgress>;
  activities: ActivityEvent[];
  chatsStarted: number;
}

interface Store {
  state: ProgressState;
  listeners: Set<() => void>;
  nextId: number;
}

const store: Store = {
  state: emptyState(),
  listeners: new Set(),
  nextId: 1,
};

function emptyState(): ProgressState {
  return { lessons: {}, challenges: {}, activities: [], chatsStarted: 0 };
}

function emit(): void {
  for (const listener of store.listeners) listener();
}

function logActivity(type: ActivityType, label: string, detail?: string): void {
  const event: ActivityEvent = {
    id: store.nextId++,
    type,
    label,
    detail,
    at: Date.now(),
  };
  store.state = {
    ...store.state,
    activities: [event, ...store.state.activities].slice(0, 15),
  };
}

/* ------------------------------- actions --------------------------------- */

export function completeLesson(course: {
  courseSlug: CourseSlug;
  courseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
}): void {
  const key = `${course.courseSlug}/${course.lessonSlug}`;
  if (store.state.lessons[key]) return;
  store.state = {
    ...store.state,
    lessons: {
      ...store.state.lessons,
      [key]: { ...course, completedAt: Date.now() },
    },
  };
  logActivity("lesson", `Completed “${course.lessonTitle}”`, course.courseTitle);
  emit();
}

export function uncompleteLesson(courseSlug: CourseSlug, lessonSlug: string): void {
  const key = `${courseSlug}/${lessonSlug}`;
  if (!store.state.lessons[key]) return;
  const lessons = { ...store.state.lessons };
  delete lessons[key];
  store.state = { ...store.state, lessons };
  emit();
}

export function isLessonCompleted(courseSlug: CourseSlug, lessonSlug: string): boolean {
  return Boolean(store.state.lessons[`${courseSlug}/${lessonSlug}`]);
}

export function recordChallengeAttempt(challenge: {
  slug: string;
  title: string;
}): void {
  const existing = store.state.challenges[challenge.slug];
  store.state = {
    ...store.state,
    challenges: {
      ...store.state.challenges,
      [challenge.slug]: {
        slug: challenge.slug,
        title: challenge.title,
        attempts: (existing?.attempts ?? 0) + 1,
        firstAttemptAt: existing?.firstAttemptAt ?? Date.now(),
        lastStatus: existing?.lastStatus ?? "attempted",
        lastAt: Date.now(),
      },
    },
  };
  if (!existing) {
    logActivity("challenge", `Attempted “${challenge.title}”`, challenge.slug);
  }
  emit();
}

export function recordChallengePassed(challenge: {
  slug: string;
  title: string;
}): void {
  const existing = store.state.challenges[challenge.slug];
  if (existing?.lastStatus === "tests-passed") return;
  store.state = {
    ...store.state,
    challenges: {
      ...store.state.challenges,
      [challenge.slug]: {
        slug: challenge.slug,
        title: challenge.title,
        attempts: existing?.attempts ?? 1,
        firstAttemptAt: existing?.firstAttemptAt ?? Date.now(),
        lastStatus: "tests-passed",
        lastAt: Date.now(),
      },
    },
  };
  logActivity("challenge", `Passed local tests in “${challenge.title}”`, challenge.slug);
  emit();
}

export function recordChatStarted(): void {
  // Only mutate when not already registering the current generation.
  store.state = { ...store.state, chatsStarted: store.state.chatsStarted + 1 };
  emit();
}

export function recordAiInteraction(
  type: Extract<ActivityType, "review" | "debug" | "chat">,
  label: string,
): void {
  logActivity(type, label);
  emit();
}

export function clearSessionProgress(): void {
  store.state = emptyState();
  emit();
}

/* ----------------------------- subscription ------------------------------ */

export function subscribe(listener: () => void): () => void {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
}

export function getSnapshot(): ProgressState {
  return store.state;
}
