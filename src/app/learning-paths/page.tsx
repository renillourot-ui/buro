import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LearningPathCard } from "@/components/learning/LearningPathCard";
import { COURSES } from "@/data/courses";

export const metadata: Metadata = {
  title: "Learning Paths",
  description: "Six structured learning paths — JavaScript, TypeScript, HTML & CSS, Python, React and Next.js.",
};

export default function LearningPathsPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Structured, static, yours"
        title="Learning Paths"
        description="Every path is a sequence of lessons written into the project itself — objectives, explanations, annotated code, common mistakes, quick quizzes and practice exercises. Lesson completion indicators below are session-only and reset when you refresh."
      />
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <p className="mb-5 flex items-start gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-[0.8125rem] leading-6 text-muted">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
          Lesson “complete” marks come from a session-only in-memory store. Refreshing the page clears every
          indicator — this app intentionally keeps no database and no browser storage.
        </p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {COURSES.map((course) => (
            <LearningPathCard key={course.slug} course={course} />
          ))}
        </div>
      </div>
    </main>
  );
}
