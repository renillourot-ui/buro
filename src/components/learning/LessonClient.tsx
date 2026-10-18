"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, CircleCheck, Lightbulb, MessageSquareCode, Target, XCircle } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Markdown } from "@/components/editor/Markdown";
import { CodeBlock } from "@/components/editor/CodeBlock";
import { HintPanel } from "./HintPanel";
import { setCodeHandoff } from "@/lib/session/handoff";
import { completeLesson, isLessonCompleted, uncompleteLesson } from "@/lib/session/progress-store";
import { cn } from "@/lib/utils/cn";
import type { Course, Lesson } from "@/types/course";

type QuizAnswer = Record<number, number>;

export function LessonClient({
  course,
  lesson,
  index,
  prev,
  next,
}: {
  course: Course;
  lesson: Lesson;
  index: number;
  prev: Lesson | null;
  next: Lesson | null;
}) {
  const [completed, setCompleted] = useState(() => isLessonCompleted(course.slug, lesson.slug));
  const [answers, setAnswers] = useState<QuizAnswer>({});

  function toggleComplete(): void {
    if (completed) {
      uncompleteLesson(course.slug, lesson.slug);
      setCompleted(false);
    } else {
      completeLesson({
        courseSlug: course.slug,
        courseTitle: course.title,
        lessonSlug: lesson.slug,
        lessonTitle: lesson.title,
      });
      setCompleted(true);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
      {/* ---------- header ---------- */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 py-5 text-[0.8125rem] text-muted">
        <Link href="/learning-paths" className="hover:text-ink">
          Learning Paths
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/learn/${course.slug}/${course.lessons[0]?.slug ?? ""}`} className="hover:text-ink">
          {course.title}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-faint">Lesson {index + 1}</span>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{course.title}</Badge>
          <Badge tone="neutral">{lesson.minutes} min read</Badge>
          <Badge tone="neutral">
            Lesson {index + 1} of {course.lessons.length}
          </Badge>
          <Badge tone={completed ? "success" : "neutral"}>{completed ? "✓ completed this session" : "session-only progress"}</Badge>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{lesson.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" variant={completed ? "secondary" : "primary"} onClick={toggleComplete} icon={<CircleCheck className="h-4 w-4" aria-hidden />}>
            {completed ? "Completed — tap to undo" : "Mark lesson complete"}
          </Button>
          <LinkButton
            href="/tutor"
            size="sm"
            variant="accent-soft"
            icon={<MessageSquareCode className="h-4 w-4" aria-hidden />}
            onClick={() =>
              setCodeHandoff({
                kind: "code",
                language: "general",
                code: "",
                question: `I'm studying the lesson “${lesson.title}” (${course.title}). Help me go deeper on the ideas in this lesson.`,
              })
            }
          >
            Ask the tutor about this lesson
          </LinkButton>
        </div>
        <p className="mt-3 text-[0.75rem] text-faint">
          Completion marks are stored in React memory for this browser session only and are intentionally cleared on refresh.
        </p>
      </header>

      {/* ---------- objectives ---------- */}
      <section aria-labelledby="objectives" className="panel mt-8 p-5">
        <h2 id="objectives" className="flex items-center gap-2 text-[0.9375rem] font-semibold">
          <Target className="h-4 w-4 text-accent" aria-hidden />
          Learning objectives
        </h2>
        <ul className="mt-3 space-y-1.5">
          {lesson.objectives.map((objective, i) => (
            <li key={i} className="flex gap-2 text-[0.875rem] leading-6 text-ink/90">
              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {objective}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- explanation sections ---------- */}
      {lesson.sections.map((section, i) => (
        <section key={i} className="mt-10" aria-labelledby={`section-${i}`}>
          <h2 id={`section-${i}`} className="text-xl font-semibold tracking-tight">
            {section.heading}
          </h2>
          <div className="prose-tutor mt-3">
            <Markdown>{section.body}</Markdown>
          </div>
        </section>
      ))}

      {/* ---------- code examples ---------- */}
      {lesson.examples.map((example, i) => (
        <section key={i} className="mt-10" aria-labelledby={`example-${i}`}>
          <h2 id={`example-${i}`} className="text-xl font-semibold tracking-tight">
            {example.title}
          </h2>
          {example.description ? <p className="mt-2 text-[0.9375rem] leading-7 text-muted">{example.description}</p> : null}
          <div className="mt-4">
            <CodeBlock code={example.code} language={example.language} title={example.language} />
          </div>
          {example.lineNotes && example.lineNotes.length > 0 ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-border">
              <div className="border-b border-border bg-raised px-3.5 py-2 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">
                Line by line
              </div>
              <ul className="divide-y divide-border">
                {example.lineNotes.map((note, j) => (
                  <li key={j} className="grid gap-1 px-3.5 py-2.5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-baseline sm:gap-3">
                    <code className="block overflow-x-auto rounded-md bg-raised px-2 py-1 font-mono text-[0.75rem] text-accent-hover">{note.code}</code>
                    <span className="text-[0.8125rem] leading-5 text-muted">{note.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ))}

      {/* ---------- common mistakes ---------- */}
      <section className="mt-12" aria-labelledby="mistakes">
        <h2 id="mistakes" className="text-xl font-semibold tracking-tight">
          Common mistakes
        </h2>
        <div className="mt-4 space-y-3">
          {lesson.mistakes.map((mistake, i) => (
            <div key={i} className="panel p-4">
              <p className="flex items-start gap-2 text-[0.875rem] font-medium text-danger">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden /> {mistake.wrong}
              </p>
              <p className="mt-2 text-[0.8125rem] leading-6 text-muted">{mistake.why}</p>
              <p className="mt-2 flex items-start gap-2 text-[0.8125rem] leading-6 text-ink/90">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> {mistake.fix}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- knowledge check ---------- */}
      <section className="mt-12" aria-labelledby="quiz">
        <h2 id="quiz" className="text-xl font-semibold tracking-tight">
          Knowledge check
        </h2>
        <p className="mt-1 text-[0.8125rem] text-muted">Answers stay in memory for this page only — they are never submitted or saved.</p>
        <div className="mt-4 space-y-4">
          {lesson.quiz.map((question, i) => (
            <QuizCard
              key={i}
              number={i + 1}
              question={question.question}
              options={question.options}
              answerIndex={question.answerIndex}
              explanation={question.explanation}
              picked={answers[i]}
              onPick={(choice) => setAnswers((a) => ({ ...a, [i]: choice }))}
            />
          ))}
        </div>
      </section>

      {/* ---------- exercises ---------- */}
      <section className="mt-12" aria-labelledby="exercises">
        <h2 id="exercises" className="text-xl font-semibold tracking-tight">
          Practice exercises
        </h2>
        <div className="mt-4 space-y-4">
          {lesson.exercises.map((exercise, i) => (
            <div key={i} className="panel p-5">
              <h3 className="text-[0.9375rem] font-semibold">{exercise.title}</h3>
              <div className="prose-tutor mt-2">
                <Markdown>{exercise.prompt}</Markdown>
              </div>
              {exercise.starterCode ? (
                <div className="mt-3">
                  <CodeBlock code={exercise.starterCode} language={exercise.language ?? lesson.examples[0]?.language} title="starter code" />
                </div>
              ) : null}
              <div className="mt-3">
                <HintPanel
                  className="-mx-3.5"
                  hints={[exercise.hint, "Still stuck? Ask the AI tutor for a walkthrough — it will coach, not just hand over the answer."]}
                  title={`Hint for exercise ${i + 1}`}
                  action={
                    <PracticeButton
                      language={exercise.language ?? lesson.examples[0]?.language ?? "javascript"}
                      starter={exercise.starterCode}
                      title={exercise.title}
                    />
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- footer nav ---------- */}
      <nav aria-label="Adjacent lessons" className="mt-14 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/learn/${course.slug}/${prev.slug}`} className="panel group flex items-center gap-3 p-4 transition-colors hover:border-border-strong hover:bg-hover">
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:-translate-x-0.5" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[0.6875rem] text-faint">Previous</span>
              <span className="block truncate text-[0.875rem] font-medium">{prev.title}</span>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/learn/${course.slug}/${next.slug}`} className="panel group flex items-center justify-end gap-3 p-4 text-right transition-colors hover:border-border-strong hover:bg-hover">
            <span className="min-w-0">
              <span className="block text-[0.6875rem] text-faint">Next</span>
              <span className="block truncate text-[0.875rem] font-medium">{next.title}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ) : (
          <Link href="/tutor" className="panel group flex items-center justify-end gap-3 p-4 transition-colors hover:border-accent-border hover:bg-hover">
            <span className="min-w-0">
              <span className="block text-[0.6875rem] text-faint">Path complete</span>
              <span className="block truncate text-[0.875rem] font-medium">Practice in the tutor →</span>
            </span>
            <BookOpenCheck className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  );
}

/* keep quiz answers one-per-question; allow changing the pick freely */

function QuizCard({
  number,
  question,
  options,
  answerIndex,
  explanation,
  picked,
  onPick,
}: {
  number: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  picked?: number;
  onPick: (choice: number) => void;
}) {
  const answered = picked !== undefined;
  const correct = picked === answerIndex;

  return (
    <fieldset className="panel p-5">
      <legend className="sr-only">{question}</legend>
      <p className="text-[0.9375rem] font-medium" id={`quiz-${number}`}>
        <span className="mr-2 font-mono text-xs text-accent">Q{number}</span>
        {question}
      </p>
      <div role="radiogroup" aria-labelledby={`quiz-${number}`} className="mt-3 grid gap-1.5">
        {options.map((option, i) => {
          const isActive = picked === i;
          const isRight = answered && i === answerIndex;
          const isWrongPick = answered && isActive && !isRight;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={isActive}
              disabled={answered}
              onClick={() => onPick(i)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[0.875rem] transition-colors",
                "disabled:cursor-default",
                !answered && "border-border bg-raised hover:border-border-strong hover:bg-hover",
                isRight && "border-success/40 bg-success/10 text-success",
                isWrongPick && "border-danger/40 bg-danger/10 text-danger",
                answered && !isRight && !isActive && "border-border bg-raised opacity-60",
                isActive && !answered && "border-accent-border bg-accent-soft text-accent-hover",
              )}
            >
              <span className="font-mono text-[0.6875rem] text-faint">{String.fromCharCode(65 + i)}</span>
              {option}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-raised px-3 py-2.5 text-[0.8125rem] leading-6 text-muted" aria-live="polite">
          {correct ? <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden /> : <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden />}
          <span>
            {correct ? "Correct. " : "Not quite. "}
            {explanation}
          </span>
        </div>
      ) : null}
    </fieldset>
  );
}

function PracticeButton({ language, starter, title }: { language: Lesson["examples"][number]["language"]; starter?: string; title: string }) {
  return (
    <LinkButton
      href="/tutor"
      size="sm"
      variant="accent-soft"
      icon={<MessageSquareCode className="h-3.5 w-3.5" aria-hidden />}
      onClick={() =>
        setCodeHandoff({
          kind: "code",
          language: language === "tsx" ? "typescript" : (language as Exclude<Lesson["examples"][number]["language"], "tsx">),
          code: starter ?? "",
          question: `Want to work through this exercise together: “${title}”?`,
        })
      }
    >
      Practice in the tutor
    </LinkButton>
  );
}
