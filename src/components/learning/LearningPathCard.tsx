"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Braces, Atom, Layers, LayoutTemplate, Terminal, FileCode2, Check } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { Course, CourseSlug } from "@/types/course";

const COURSE_LINES: Record<CourseSlug, string> = {
  "javascript-fundamentals": "Learn the language from zero — values, control flow, functions, the DOM and async patterns.",
  "typescript-fundamentals": "Level up with types that catch bugs before code runs.",
  "html-and-css": "Build and style real pages with modern, accessible markup and layout.",
  "python-fundamentals": "Python 3 fundamentals from variables to the standard library.",
  "react-fundamentals": "Components, state and effects with a mental model you can keep.",
  "nextjs-fundamentals": "App Router in practice — the framework this app itself is built on.",
};

export function LearningPathCard({ course, showNote }: { course: Course; showNote?: string }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = ICONS[course.slug] ?? Braces;
  const firstThree = course.lessons.slice(0, 3);
  const rest = course.lessons.slice(3);

  return (
    <div className="panel flex h-full flex-col p-5">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border"
          style={{ borderColor: `${course.accent}44`, background: `${course.accent}14`, color: course.accent }}
          aria-hidden
        >
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-semibold">{course.title}</h3>
          <p className="mt-0.5 text-[0.8125rem] text-muted">{course.tagline}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5">
        {firstThree.map((lesson, i) => (
          <li key={lesson.slug}>
            <Link
              href={`/learn/${course.slug}/${lesson.slug}`}
              className="group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.8125rem] text-muted transition-colors hover:bg-hover hover:text-ink"
            >
              <span className="font-mono text-[0.6875rem] text-faint">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 truncate">{lesson.title}</span>
              <span className="ml-auto hidden text-[0.6875rem] text-faint sm:block">{lesson.minutes} min</span>
            </Link>
          </li>
        ))}
      </ul>

      {rest.length > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className={cn(
            "mt-1 flex items-center gap-1.5 self-start rounded-lg px-2.5 py-1.5 text-[0.75rem] font-medium text-accent-hover transition-colors hover:bg-accent-soft",
          )}
        >
          {expanded ? "Hide" : `+ ${rest.length} more lessons`}
          <ArrowRight className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-90")} aria-hidden />
        </button>
      ) : null}

      {expanded ? (
        <ul className="mt-1 space-y-1.5">
          {rest.map((lesson, i) => (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${course.slug}/${lesson.slug}`}
                className="group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[0.8125rem] text-muted transition-colors hover:bg-hover hover:text-ink"
              >
                <span className="font-mono text-[0.6875rem] text-faint">{String(i + 4).padStart(2, "0")}</span>
                <span className="min-w-0 truncate">{lesson.title}</span>
                <span className="ml-auto hidden text-[0.6875rem] text-faint sm:block">{lesson.minutes} min</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-[0.8125rem] leading-6 text-muted">{course.description}</p>

      <div className="mt-4 flex-1" />

      <div className="flex items-center justify-between gap-2 pt-2">
        <Badge tone={course.difficulty === "beginner" ? "success" : "accent"}>{course.difficulty}</Badge>
        <span className="text-[0.6875rem] text-faint">
          {course.lessons.length} lessons · ~{Math.round(course.lessons.reduce((sum, l) => sum + l.minutes, 0) / 5) * 5} min
        </span>
      </div>
      <LinkButton href={`/learn/${course.slug}/${course.lessons[0]?.slug ?? ""}`} size="sm" className="mt-3 w-full" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
        Start this path
      </LinkButton>
      {showNote ? <p className="mt-2 text-[0.6875rem] text-faint">{showNote}</p> : null}
    </div>
  );
}

export function LessonCard({
  courseSlug,
  lesson,
  ordinal,
  href,
  completed,
}: {
  courseSlug: CourseSlug;
  lesson: Course["lessons"][number];
  ordinal: number;
  href: string;
  completed?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong hover:bg-hover"
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-raised font-mono text-[0.6875rem] text-muted">
        {completed ? <Check className="h-3.5 w-3.5 text-success" aria-label="Completed this session" /> : String(ordinal).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.875rem] font-medium">{lesson.title}</span>
        <span className="block truncate text-[0.6875rem] text-faint">
          {lesson.objectives[0] ?? COURSE_LINES[courseSlug] ?? ""}
        </span>
      </span>
      <span className="shrink-0 text-[0.6875rem] text-faint">{lesson.minutes} min</span>
    </Link>
  );
}

const ICONS: Record<CourseSlug, typeof Braces> = {
  "javascript-fundamentals": FileCode2,
  "typescript-fundamentals": Braces,
  "html-and-css": LayoutTemplate,
  "python-fundamentals": Terminal,
  "react-fundamentals": Atom,
  "nextjs-fundamentals": Layers,
};
