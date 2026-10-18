"use client";

import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCall, type TestOutcome } from "@/lib/challenges/runner";
import { cn } from "@/lib/utils/cn";
import type { Challenge } from "@/types/challenges";

/* --------------------------------- card ---------------------------------- */

export function ChallengeCard({
  challenge,
  onOpen,
}: {
  challenge: Challenge;
  onOpen: (slug: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(challenge.slug)}
      className="panel group flex h-full flex-col gap-3 p-4 text-left transition-colors hover:border-border-strong hover:bg-hover focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="flex items-center justify-between gap-2">
        <DifficultyChip difficulty={challenge.difficulty} />
        <span className="font-mono text-[0.6875rem] text-faint">{challenge.language}</span>
      </div>
      <h3 className="text-[0.9375rem] font-semibold group-hover:text-accent-hover">{challenge.title}</h3>
      <p className="line-clamp-2 text-[0.8125rem] leading-5 text-muted">{firstParagraph(challenge.description)}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
        {challenge.tests ? <Badge tone="success">local tests</Badge> : <Badge tone="info">AI feedback</Badge>}
        {challenge.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} tone="neutral">
            {tag}
          </Badge>
        ))}
      </div>
    </button>
  );
}

function firstParagraph(markdown: string): string {
  const plain = markdown.replace(/[#*`>\[\]]/g, "").trim();
  const first = plain.split("\n")[0] ?? "";
  return first.length > 140 ? `${first.slice(0, 137)}…` : first;
}

export function DifficultyChip({ difficulty }: { difficulty: Challenge["difficulty"] }) {
  const cls =
    difficulty === "easy"
      ? "text-success border-success/30 bg-success/10"
      : difficulty === "medium"
        ? "text-warning border-warning/30 bg-warning/10"
        : "text-danger border-danger/30 bg-danger/10";
  return <span className={cn("rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold capitalize", cls)}>{difficulty}</span>;
}

/* ------------------------------ test results ----------------------------- */

export function TestResults({
  running,
  outcomes,
  loadError,
  timedOut,
  challenge,
}: {
  running: boolean;
  outcomes: TestOutcome[];
  loadError?: string;
  timedOut?: boolean;
  challenge: Challenge;
}) {
  if (running) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-raised px-3 py-2.5 text-[0.8125rem] text-muted">
        <Loader2 className="h-4 w-4 animate-spin text-accent" aria-hidden />
        Running test cases in a local sandbox…
      </div>
    );
  }

  if (timedOut) {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5 text-[0.8125rem] text-warning">
        <AlertTriangle className="mr-2 inline h-4 w-4" aria-hidden />
        The run was stopped after 2.5 s — check for an infinite loop or very slow work.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/10 px-3 py-2.5">
        <p className="text-[0.8125rem] font-medium text-danger">The code could not start.</p>
        <pre className="mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-muted">{loadError}</pre>
      </div>
    );
  }

  if (outcomes.length === 0) return null;

  const passed = outcomes.filter((o) => o.pass).length;
  const all = passed === outcomes.length;

  return (
    <div>
      <div className="mb-2 text-[0.8125rem]">
        {all ? (
          <span className="font-medium text-success">All {outcomes.length} test case{outcomes.length > 1 ? "s" : ""} passed.</span>
        ) : (
          <span className="font-medium">
            <span className="text-ink">{passed}/{outcomes.length}</span> <span className="text-muted">test cases passing</span>
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {outcomes.map((outcome, i) => (
          <li
            key={i}
            className={cn(
              "flex flex-wrap items-start gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
              outcome.pass ? "border-success/25 bg-success/8" : "border-danger/25 bg-danger/10",
            )}
          >
            {outcome.pass ? (
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" aria-hidden />
            ) : (
              <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" aria-hidden />
            )}
            <span className="text-ink/90">{outcome.label}</span>
            {!outcome.pass && outcome.got !== undefined ? (
              <span className="text-faint">
                expected <span className="text-success">{formatExpected(challenge, i)}</span>, got{" "}
                <span className="text-danger">{outcome.got}</span>
              </span>
            ) : null}
            {outcome.error ? <span className="w-full text-danger">{outcome.error}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatExpected(challenge: Challenge, index: number): string {
  const test = challenge.tests?.[index];
  if (!test) return "(unknown)";
  try {
    return JSON.stringify(test.expected);
  } catch {
    return String(test.expected);
  }
}

export function TestCallList({ challenge }: { challenge: Challenge }) {
  if (!challenge.tests) return null;
  return (
    <ol className="space-y-1">
      {challenge.tests.slice(0, 4).map((t, i) => (
        <li key={i} className="font-mono text-[0.6875rem] text-faint">
          {formatCall(t)} → checked on submit
        </li>
      ))}
      {challenge.tests.length > 4 ? <li className="text-[0.6875rem] text-faint">+{challenge.tests.length - 4} more hidden</li> : null}
    </ol>
  );
}
