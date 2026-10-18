"use client";

import { Info, ListPlus, MessageSquarePlus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Controls";
import { SUGGESTED_TOPICS, learningPrompts } from "@/data/prompts";
import { LANGUAGES, type SkillLevel, type TutorLanguage, type TutorMode } from "@/types";
import { ModeSelector } from "./ModeSelector";
import { SkillLevelSelector } from "./SkillLevelSelector";

const LANGUAGE_OPTIONS = LANGUAGES.map((l) => ({ value: l.id, label: l.label }));

interface ContextSidebarProps {
  language: TutorLanguage;
  onLanguageChange: (language: TutorLanguage) => void;
  level: SkillLevel;
  onLevelChange: (level: SkillLevel) => void;
  mode: TutorMode;
  onModeChange: (mode: TutorMode) => void;
  beginner: boolean;
  onBeginnerChange: (beginner: boolean) => void;
  generating: boolean;
  onNewChat: () => void;
  onPickPrompt: (prompt: string) => void;
}

/**
 * Left panel — learning context for THIS conversation only. There is no
 * conversation history section anywhere in the app on purpose.
 */
export function ContextSidebar({
  language,
  onLanguageChange,
  level,
  onLevelChange,
  mode,
  onModeChange,
  beginner,
  onBeginnerChange,
  onNewChat,
  onPickPrompt,
}: ContextSidebarProps) {
  const topics = SUGGESTED_TOPICS[language];

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <section>
        <Button
          size="sm"
          onClick={onNewChat}
          icon={<MessageSquarePlus className="h-4 w-4" aria-hidden />}
          className="w-full"
          aria-label="Start a new chat (clears the current conversation)"
        >
          New Chat
        </Button>
        <p className="mt-2 flex items-start gap-1.5 text-[0.6875rem] leading-4 text-faint">
          <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
          Conversations exist only in this tab&apos;s memory — nothing is saved, and a refresh starts fresh.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">Language</h2>
        <Select value={language} options={LANGUAGE_OPTIONS} onChange={(v) => onLanguageChange(v as TutorLanguage)} label="Programming language" size="sm" />
      </section>

      <section>
        <h2 className="mb-2 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">Skill level</h2>
        <SkillLevelSelector value={level} onChange={onLevelChange} className="flex w-full" />
      </section>

      <section>
        <h2 className="mb-2 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">Tutoring mode</h2>
        <ModeSelector value={mode} onChange={onModeChange} />
      </section>

      <section>
        <h2 className="sr-only">Beginner explanations</h2>
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-raised px-3 py-2.5 text-[0.8125rem] text-muted hover:border-border-strong">
          <span>
            Explain like I&apos;m a beginner
            <span className="block text-[0.6875rem] text-faint">Plain analogies before jargon</span>
          </span>
          <input
            type="checkbox"
            checked={beginner}
            onChange={(e) => onBeginnerChange(e.target.checked)}
            className="accent-accent size-4 shrink-0"
          />
        </label>
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">
          <ListPlus className="h-3 w-3" aria-hidden />
          Suggested topics
        </h2>
        <ul className="space-y-1">
          {topics.map((topic) => (
            <li key={topic}>
              <button
                type="button"
                onClick={() => onPickPrompt(topic)}
                className="w-full rounded-lg px-2.5 py-2 text-left text-[0.8125rem] leading-5 text-muted transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">
          <RotateCcw className="h-3 w-3" aria-hidden />
          Learning prompts
        </h2>
        <ul className="space-y-1">
          {learningPrompts(language).map((prompt) => (
            <li key={prompt}>
              <button
                type="button"
                onClick={() => onPickPrompt(prompt)}
                className="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left text-[0.8125rem] leading-5 text-muted transition-colors hover:bg-hover hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
              >
                <Plus className="mt-0.5 h-3 w-3 shrink-0 text-accent" aria-hidden />
                {prompt}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
