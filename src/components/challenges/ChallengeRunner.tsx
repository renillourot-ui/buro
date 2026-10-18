"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Play, RotateCcw, ScanSearch, Send } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge } from "@/components/ui/Badge";
import { ErrorMessage } from "@/components/ui/Feedback";
import { MarkdownSkeleton, Spinner } from "@/components/ui/Spinner";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { CopyButton, CodeBlock } from "@/components/editor/CodeBlock";
import { Markdown } from "@/components/editor/Markdown";
import { HintPanel } from "@/components/learning/HintPanel";
import { TestResults } from "./ChallengeCard";
import { runChallengeTests, type TestRunResult } from "@/lib/challenges/runner";
import { postAnalysis, networkError } from "@/lib/api-client";
import { recordChallengeAttempt, recordChallengePassed } from "@/lib/session/progress-store";
import { setCodeHandoff } from "@/lib/session/handoff";
import { cn } from "@/lib/utils/cn";
import type { Challenge } from "@/types/challenges";
import type { CodeLanguage } from "@/types";

const AI_LEVEL = "intermediate" as const;

/** Track review state per challenge (memory only — resets with the page). */
interface AiState {
  status: "idle" | "loading" | "done" | "error";
  feedback?: string;
  error?: string;
}

interface RunState {
  status: "idle" | "running" | "done";
  result?: TestRunResult;
}

export function ChallengeRunner({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const [code, setCode] = useState(challenge.starterCode);
  const [run, setRun] = useState<RunState>({ status: "idle" });
  const [ai, setAi] = useState<AiState>({ status: "idle" });
  const [confirm, setConfirm] = useState<"reset" | "solution" | null>(null);
  const [solutionShown, setSolutionShown] = useState(false);
  const attemptedRef = useRef(false);
  const aiAbortRef = useRef<AbortController | null>(null);

  // Fresh attempt state is guaranteed by the parent keying this component.
  useEffect(() => () => aiAbortRef.current?.abort(), []);

  const mappedLanguage: CodeLanguage = challenge.language === "tsx" ? "typescript" : (challenge.language as CodeLanguage);
  const hasTests = Boolean(challenge.tests);

  function markAttempted(): void {
    if (!attemptedRef.current) {
      attemptedRef.current = true;
      recordChallengeAttempt(challenge);
    }
  }

  async function runTests(): Promise<void> {
    if (!challenge.tests || run.status === "running") return;
    setRun({ status: "running" });
    markAttempted();
    const result = await runChallengeTests(code, challenge.tests);
    setRun({ status: "done", result });
    const outcomes = result.outcomes;
    const attemptedAny = outcomes.length > 0 && !result.loadError;
    if (attemptedAny && outcomes.every((o) => o.pass)) {
      recordChallengePassed(challenge);
      setSolutionShownSolution();
    }
  }

  function setSolutionShownSolution(): void {
    // Passing the local tests unlocks the solution discussion ("verified").
    setSolutionShown(true);
  }

  async function submitForAiReview(): Promise<void> {
    if (ai.status === "loading") return;
    aiAbortRef.current?.abort();
    const controller = new AbortController();
    aiAbortRef.current = controller;
    setAi({ status: "loading" });
    markAttempted();
    try {
      const response = await postAnalysis(
        "/api/tutor/review-code",
        {
          code,
          language: mappedLanguage,
          level: AI_LEVEL,
          question: `This is my attempt at the challenge "${challenge.title}". Requirements: ${firstParagraph(challenge.description)}. Comment on correctness (assuming the stated constraints), readability, and suggest an idiomatic improvement.`,
        },
        controller.signal,
      );
      if (aiAbortRef.current !== controller) return;
      setAi({ status: "done", feedback: response.feedback });
      setSolutionShown(true);
    } catch (err) {
      if (aiAbortRef.current !== controller) return;
      const apiError = networkError(err);
      if (apiError.code === "aborted") return;
      setAi({ status: "error", error: apiError.message });
    }
  }

  function sendToTutor(): void {
    setCodeHandoff({
      kind: "code",
      language: mappedLanguage,
      code,
      question: `I'm working on the challenge "${challenge.title}". Can we go through my approach together?`,
    });
    router.push("/tutor");
  }

  const problemMarkdown = challenge.description;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.push("/challenges")} icon={<ArrowLeft className="h-4 w-4" aria-hidden />}>
          All challenges
        </Button>
        <div className="ml-auto flex items-center gap-2 text-[0.6875rem] text-faint">
          {hasTests ? <Badge tone="success">Deterministic local tests</Badge> : <Badge tone="info">AI feedback — no test execution</Badge>}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* -------- problem -------- */}
        <div className="space-y-4">
          <div className="panel p-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{challenge.title}</h2>
              <Badge tone="neutral">{challenge.language}</Badge>
            </div>
            <div className="prose-tutor mt-3">
              <Markdown>{problemMarkdown}</Markdown>
            </div>
            {challenge.examples.length > 0 ? (
              <div className="mt-4">
                <h3 className="mb-2 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">Examples</h3>
                <div className="space-y-1.5 rounded-xl border border-border bg-code-bg p-3 font-mono text-xs">
                  {challenge.examples.map((example, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-ink/90">{example.input}</span>
                      <span className="text-muted">{example.output}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <HintPanel hints={challenge.hints} title="Hints" className="px-0" />

          {solutionShown ? (
            <div className="panel p-5">
              <h3 className="text-[0.9375rem] font-semibold">Solution discussion</h3>
              <div className="prose-tutor mt-2">
                <Markdown>{challenge.solutionApproach}</Markdown>
              </div>
              <div className="mt-3">
                <CodeBlock code={challenge.solutionCode} language={challenge.language} title="Reference solution" />
              </div>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setConfirm("solution")}>
              Reveal solution discussion
            </Button>
          )}
        </div>

        {/* -------- editor + checks -------- */}
        <div className="space-y-3">
          <div className={cn("panel flex min-h-[380px] flex-col overflow-hidden")}>
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
              <span className="font-mono text-[0.6875rem] text-faint">your solution</span>
              <div className="flex items-center gap-1.5">
                <CopyButton text={code} label="Copy" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirm("reset")}
                  icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
                  aria-label="Reset to starter code"
                />
              </div>
            </div>
            <div className="min-h-[300px] flex-1">
              <CodeEditor value={code} onChange={setCode} language={mappedLanguage} ariaLabel="Challenge solver editor" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hasTests ? (
              <Button onClick={runTests} loading={run.status === "running"} icon={<Play className="h-4 w-4" aria-hidden />}>
                Run tests
              </Button>
            ) : null}
            <Button
              onClick={submitForAiReview}
              loading={ai.status === "loading"}
              variant={hasTests ? "secondary" : "primary"}
              icon={<ScanSearch className="h-4 w-4" aria-hidden />}
            >
              Submit for AI feedback
            </Button>
            <LinkButton href="/tutor" variant="ghost" size="sm" onClick={sendToTutor} icon={<Send className="h-3.5 w-3.5" aria-hidden />}>
              Work on it in the Tutor
            </LinkButton>
          </div>

          {hasTests ? (
            <p className="text-[0.6875rem] leading-5 text-faint">
              Tests execute in a temporary sandbox inside your own browser and are never uploaded. The AI feedback
              request sends the current code to the tutor backend (where nothing is stored either).
            </p>
          ) : null}

          {hasTests ? <TestResults running={run.status === "running"} outcomes={run.result?.outcomes ?? []} loadError={run.result?.loadError} timedOut={run.result?.timedOut} challenge={challenge} /> : null}

          {ai.status === "loading" ? (
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-xs text-muted">
                <Spinner /> Getting AI feedback…
              </span>
              <MarkdownSkeleton />
            </div>
          ) : null}

          {ai.status === "error" && ai.error ? (
            <ErrorMessage title="The AI request failed" message={ai.error} onRetry={submitForAiReview} />
          ) : null}

          {ai.status === "done" && ai.feedback ? (
            <div className="panel p-4" data-label="ai-feedback">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-[0.8125rem] font-semibold">
                  <ExternalLink className="h-3.5 w-3.5 text-info" aria-hidden />
                  AI feedback
                </h3>
                <Badge tone="info">review only — your code did not run here</Badge>
              </div>
              <Markdown>{ai.feedback}</Markdown>
            </div>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "reset"}
        title="Reset to starter code?"
        description="Your current solution in the editor will be replaced with the original starter code."
        confirmLabel="Reset code"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setCode(challenge.starterCode);
          setRun({ status: "idle" });
          setConfirm(null);
        }}
      />
      <ConfirmDialog
        open={confirm === "solution"}
        title="Reveal the solution?"
        description="Giving up too early is the #1 learning shortcut that stings later. Hints are still free if you want to keep trying."
        confirmLabel="Reveal anyway"
        cancelLabel="Keep trying"
        destructive
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setSolutionShown(true);
          setConfirm(null);
        }}
      />
    </>
  );
}

function firstParagraph(markdown: string): string {
  const plain = markdown.replace(/[#*`>\[\]]/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > 300 ? `${plain.slice(0, 297)}…` : plain;
}
