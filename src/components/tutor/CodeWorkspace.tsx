"use client";

import { useState } from "react";
import { MessageSquareCode, RotateCcw, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Controls";
import { Badge } from "@/components/ui/Badge";
import { MarkdownSkeleton, Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/Feedback";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { CopyButton } from "@/components/editor/CodeBlock";
import { Markdown } from "@/components/editor/Markdown";
import { LanguageSelector } from "@/components/editor/LanguageSelector";
import { TEMPLATES, templateByIndex } from "@/data/templates";
import type { CodeLanguage } from "@/types";
import type { ReviewState } from "./types";

interface CodeWorkspaceProps {
  language: CodeLanguage;
  code: string;
  onLanguageChange: (language: CodeLanguage) => void;
  onCodeChange: (code: string) => void;
  onReset: () => void;
  review: ReviewState;
  onReview: () => void;
  onRetryReview: () => void;
  onDiscussCode: () => void;
}

/**
 * Right panel — an independent Monaco workspace. It never executes code;
 * "Review" runs a static AI analysis via /api/tutor/review-code, honestly
 * labelled as AI review (never as verified execution).
 */
export function CodeWorkspace({
  language,
  code,
  onLanguageChange,
  onCodeChange,
  onReset,
  review,
  onReview,
  onRetryReview,
  onDiscussCode,
}: CodeWorkspaceProps) {
  const templates = TEMPLATES[language];
  // Picker selection is derived per language — no resync effect needed.
  const [templatePick, setTemplatePick] = useState<{ language: CodeLanguage; index: number }>({ language, index: 0 });
  const templateIndex = templatePick.language === language ? templatePick.index : 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-13 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface/40 px-3 py-2 sm:px-3.5">
        <h2 className="text-[0.9375rem] font-semibold">Code Workspace</h2>
        <div className="flex items-center gap-1.5">
          <LanguageSelector value={language} onChange={onLanguageChange} />
        </div>
      </header>

      <div className="flex h-9 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface/20 px-3 sm:px-3.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Select
            label="Starter template"
            size="sm"
            className="w-40"
            value={String(templateIndex)}
            options={templates.map((t, i) => ({ value: String(i), label: t.name }))}
            onChange={(v) => {
              const index = Number(v);
              setTemplatePick({ language, index });
              onCodeChange(templateByIndex(language, index));
            }}
          />
          <Button variant="ghost" size="sm" onClick={onReset} aria-label="Reset to starter template" title="Reset code" icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />} />
        </div>
        <div className="flex items-center gap-1.5">
          <CopyButton text={code} label="Copy" />
          <Button
            variant="secondary"
            size="sm"
            onClick={onDiscussCode}
            icon={<MessageSquareCode className="h-3.5 w-3.5" aria-hidden />}
            aria-label="Ask the tutor about this code in chat"
            className="max-sm:hidden"
          >
            Ask tutor
          </Button>
          <Button
            size="sm"
            onClick={onReview}
            disabled={code.trim().length === 0 || review.status === "loading"}
            icon={<ScanSearch className="h-3.5 w-3.5" aria-hidden />}
            aria-label="Send code for AI review"
          >
            Review
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <CodeEditor value={code} onChange={onCodeChange} language={language} ariaLabel={`${language} code editor`} />
      </div>

      <div className="flex h-[38%] min-h-0 shrink-0 flex-col border-t border-border bg-surface/60" data-testid="review-panel">
        <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-border px-3">
          <h3 className="flex items-center gap-1.5 text-[0.8125rem] font-semibold">
            <span className="size-1.5 rounded-full" style={{ background: "var(--color-accent)" }} aria-hidden />
            Code feedback
          </h3>
          <Badge tone="info">AI analysis — not executed</Badge>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
          {review.status === "idle" ? (
            <p className="text-[0.8125rem] leading-6 text-muted">
              Press <span className="font-semibold text-ink">Review</span> to get static AI feedback on this code:
              issues ranked by severity, a suggested revision, and takeaways. Nothing is executed and nothing is
              stored.
            </p>
          ) : null}
          {review.status === "loading" ? (
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs text-muted">
                <Spinner /> Analyzing your code…
              </span>
              <MarkdownSkeleton />
            </div>
          ) : null}
          {review.status === "done" && review.result ? (
            <div>
              {review.result.servedModel ? (
                <p className="mb-2 text-[0.6875rem] text-faint">Served by {review.result.servedModel}</p>
              ) : null}
              <Markdown>{review.result.feedback}</Markdown>
            </div>
          ) : null}
          {review.status === "error" && review.error ? (
            <ErrorMessage title="The AI request failed" message={review.error} onRetry={onRetryReview} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
