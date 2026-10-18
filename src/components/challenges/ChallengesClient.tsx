"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SegmentedControl } from "@/components/ui/Controls";
import { EmptyState } from "@/components/ui/Feedback";
import { ChallengeCard } from "./ChallengeCard";
import { ChallengeRunner } from "./ChallengeRunner";
import { challenges } from "@/data/challenges";
import type { Challenge, ChallengeDifficulty } from "@/types/challenges";

const DIFFICULTY_OPTIONS = [
  { value: "all", label: "All levels" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const LANGUAGE_OPTIONS = [
  { value: "all", label: "All languages" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

export function ChallengesClient() {
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | "all">("all");
  const [language, setLanguage] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return challenges.filter((challenge) => {
      if (difficulty !== "all" && challenge.difficulty !== difficulty) return false;
      if (language !== "all" && challenge.language !== language) return false;
      if (!needle) return true;
      const haystack = `${challenge.title} ${challenge.tags.join(" ")} ${challenge.description}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [difficulty, language, query]);

  const selectedChallenge: Challenge | undefined = useMemo(
    () => challenges.find((c) => c.slug === selected),
    [selected],
  );

  if (selectedChallenge) {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <ChallengeRunner key={selectedChallenge.slug} challenge={selectedChallenge} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="panel mb-6 flex flex-col gap-3 p-3.5 md:flex-row md:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-raised px-3">
          <Search className="h-4 w-4 shrink-0 text-faint" aria-hidden />
          <span className="sr-only">Search challenges</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tag or topic…"
            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-faint"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            value={difficulty}
            options={DIFFICULTY_OPTIONS}
            onChange={(v) => setDifficulty(v as ChallengeDifficulty | "all")}
            size="md"
          />
          <SegmentedControl
            value={language}
            options={LANGUAGE_OPTIONS}
            onChange={(v) => setLanguage(v)}
            size="md"
            className="max-w-full overflow-x-auto"
          />
        </div>
      </div>

      <p className="mb-4 text-[0.8125rem] text-muted" aria-live="polite">
        {filtered.length} challenge{filtered.length === 1 ? "" : "s"} · JavaScript challenges include deterministic
        local tests; others are reviewed by the AI and clearly labeled as feedback — never as real execution.
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          className="panel"
          icon={<Search className="h-5 w-5" />}
          title="No challenges match those filters"
          description="Try a different difficulty or language, or clear the search."
          action={
            <button
              className="rounded-lg border border-border bg-raised px-3 py-2 text-sm text-muted hover:text-ink"
              onClick={() => {
                setDifficulty("all");
                setLanguage("all");
                setQuery("");
              }}
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((challenge) => (
            <ChallengeCard key={challenge.slug} challenge={challenge} onOpen={setSelected} />
          ))}
        </div>
      )}
    </div>
  );
}
