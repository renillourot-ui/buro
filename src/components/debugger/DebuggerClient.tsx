"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bug, Code2, GraduationCap, HelpCircle, Lightbulb, RotateCcw, Wrench, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Controls";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorMessage } from "@/components/ui/Feedback";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { LanguageSelector } from "@/components/editor/LanguageSelector";
import { Markdown } from "@/components/editor/Markdown";
import { CopyButton } from "@/components/editor/CodeBlock";
import { templateFor } from "@/data/templates";
import { postAnalysis, networkError } from "@/lib/api-client";
import { setCodeHandoff } from "@/lib/session/handoff";
import { recordAiInteraction } from "@/lib/session/progress-store";
import { alignMarkdownSections } from "@/lib/markdown-sections";
import type { SkillLevel, CodeLanguage } from "@/types";

interface DebugSection {
  title: string;
  body: string;
  icon: LucideIcon;
  tone: "danger" | "info" | "accent" | "success" | "success" | "neutral";
}

interface Analysis {
  sections: DebugSection[];
  servedModel?: string;
}

const SECTION_TITLES = ["Problem Identified", "Why It Happens", "Hint", "Suggested Fix", "Improved Code", "What You Learned"];
const SECTION_ICONS: LucideIcon[] = [Bug, HelpCircle, Lightbulb, Wrench, Code2, GraduationCap];
const SECTION_TONES: DebugSection["tone"][] = ["danger", "info", "accent", "success", "accent", "neutral"];

export function DebuggerClient() {
  const [language, setLanguage] = useState<CodeLanguage>("javascript");
  const [code, setCode] = useState(templateFor("javascript"));
  const [level, setLevel] = useState<SkillLevel>("intermediate");
  const [errorMessage, setErrorMessage] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<Analysis | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function analyze(): Promise<void> {
    if (status === "loading") return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus("loading");
    setApiError(null);
    try {
      const response = await postAnalysis(
        "/api/debugger/analyze",
        { code, language, level, errorMessage, expected, actual },
        controller.signal,
      );
      if (abortRef.current !== controller) return;
      const aligned = alignMarkdownSections(response.feedback, SECTION_TITLES);
      const sections: DebugSection[] = aligned
        .filter((s) => s.body.length > 0)
        .map((s, i) => ({
          title: s.title || SECTION_TITLES[i] || "Analysis",
          body: s.body,
          icon: SECTION_ICONS[i] ?? Code2,
          tone: SECTION_TONES[i] ?? "accent",
        }));
      setResult({ sections, servedModel: response.servedModel });
      setStatus(sections.length > 0 ? "done" : "error");
      if (sections.length === 0) setApiError("The AI returned an empty analysis — please try again.");
      else recordAiInteraction("debug", "Analyzed an error with the assistant");
    } catch (err) {
      if (abortRef.current !== controller) return;
      const apiError = networkError(err);
      if (apiError.code === "aborted") return;
      setApiError(apiError.message);
      setStatus("error");
    }
  }

  function clearAll(): void {
    setErrorMessage("");
    setExpected("");
    setActual("");
  }

  function sendToTutor(): void {
    setCodeHandoff({
      kind: "code",
      language,
      code,
      question: "I need help debugging this code. Walk me through the problem step by step.",
    });
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ---------- inputs ---------- */}
      <div className="panel flex min-h-[520px] flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2">
            <LanguageSelector
              value={language}
              onChange={(v) => {
                setLanguage(v);
                setCode(templateFor(v));
              }}
            />
            <Select
              label="Your level"
              size="sm"
              className="w-40"
              value={level}
              options={[
                { value: "beginner", label: "Beginner" },
                { value: "intermediate", label: "Intermediate" },
                { value: "advanced", label: "Advanced" },
              ]}
              onChange={(v) => setLevel(v as SkillLevel)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <CopyButton text={code} label="Copy code" />
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw className="h-3.5 w-3.5" aria-hidden />}
              onClick={() => setCode(templateFor(language))}
              aria-label="Reset code to template"
            >
              Reset
            </Button>
          </div>
        </div>
        <div className="min-h-[300px] flex-1">
          <CodeEditor value={code} onChange={setCode} language={language} ariaLabel="Your code" />
        </div>
        <div className="grid gap-3 border-t border-border p-4 sm:grid-cols-2">
          <label className="sm:col-span-2 block">
            <span className="mb-1.5 block text-[0.8125rem] font-medium">Error message — copy the exact text if there is one</span>
            <textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              rows={3}
              placeholder="e.g. TypeError: Cannot read properties of undefined (reading 'name')"
              className="w-full resize-y rounded-lg border border-border bg-code-bg px-3 py-2 font-mono text-[0.8125rem] text-ink outline-none placeholder:text-faint focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.8125rem] font-medium">What should happen?</span>
            <textarea
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              rows={3}
              placeholder="Expected behavior"
              className="w-full resize-y rounded-lg border border-border bg-raised px-3 py-2 text-[0.8125rem] outline-none placeholder:text-faint focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[0.8125rem] font-medium">What happens instead?</span>
            <textarea
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              rows={3}
              placeholder="Actual behavior"
              className="w-full resize-y rounded-lg border border-border bg-raised px-3 py-2 text-[0.8125rem] outline-none placeholder:text-faint focus-visible:outline-2 focus-visible:outline-accent"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <Button onClick={analyze} loading={status === "loading"} icon={<Bug className="h-4 w-4" aria-hidden />} className="min-w-44">
              {status === "loading" ? "Analyzing…" : "Analyze Error"}
            </Button>
            <Button variant="secondary" onClick={clearAll} disabled={status === "loading"}>
              Clear fields
            </Button>
            <Link
              href="/tutor"
              onClick={sendToTutor}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-accent-border bg-accent-soft px-4 text-sm font-medium text-accent-hover transition-colors hover:bg-accent/20"
            >
              Debug it in the Tutor
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- result ---------- */}
      <div className="panel min-h-[520px] overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <h2 className="text-[0.9375rem] font-semibold">Analysis</h2>
          <span className="text-[0.6875rem] text-faint">
            {result?.servedModel ? `Served by ${result.servedModel}` : "AI reasoning — no fabricated output"}
          </span>
        </div>
        <div className="max-h-[75vh] min-h-[400px] overflow-y-auto p-4">
          {status === "idle" ? (
            <div className="px-2 py-14 text-center text-[0.8125rem] leading-6 text-muted">
              <p className="font-medium text-ink">Paste your code and describe the bug.</p>
              <p className="mt-1">
                It helps to include the exact error message, the expected behavior, and what happens instead — then
                press <span className="font-semibold text-ink">Analyze Error</span>.
              </p>
            </div>
          ) : null}

          {status === "loading" ? (
            <div className="flex items-center gap-2 py-2 text-sm text-muted">
              <Spinner /> Tracing the bug…
            </div>
          ) : null}

          {status === "error" && apiError ? (
            <ErrorMessage title="The analysis request failed" message={apiError} onRetry={analyze} />
          ) : null}

          {status === "done" && result ? (
            <div className="space-y-4">
              {result.sections.map((section) => (
                <ResultSection key={section.title} section={section} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const TONE_CLS: Record<DebugSection["tone"], string> = {
  danger: "text-danger",
  info: "text-info",
  accent: "text-accent-hover",
  success: "text-success",
  neutral: "text-muted",
};

function ResultSection({ section }: { section: DebugSection }) {
  const Icon = section.icon;
  return (
    <div className="rounded-xl border border-border bg-raised/60">
      <div className="flex items-center gap-2 border-b border-border px-3.5 py-2">
        <span
          className={cn(
            "flex size-6 items-center justify-center rounded-md border border-border bg-surface",
            TONE_CLS[section.tone],
          )}
          aria-hidden
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-[0.8125rem] font-semibold">{section.title}</h3>
      </div>
      <div className="px-3.5 py-3">
        {section.body ? <Markdown>{section.body}</Markdown> : <p className="text-[0.8125rem] text-faint">—</p>}
      </div>
    </div>
  );
}
