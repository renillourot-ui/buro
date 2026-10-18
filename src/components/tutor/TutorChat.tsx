"use client";

import { useEffect, useRef } from "react";
import { MessageSquarePlus, PanelLeft, PanelRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ChatMessage } from "@/types";
import { ChatMessageItem } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { FollowUpChips } from "./FollowUpChips";
import { CodeMentorAvatar } from "./CodeMentorAvatar";

interface TutorChatProps {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  generating: boolean;
  followUps: string[];
  onPickFollowUp: (text: string) => void;
  onRetryMessage: (id: string) => void;
  chips: string[];
  onNewChat: () => void;
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

export function TutorChat(props: TutorChatProps) {
  const {
    messages,
    input,
    onInputChange,
    onSend,
    onStop,
    generating,
    followUps,
    onPickFollowUp,
    onRetryMessage,
    chips,
    onNewChat,
    leftOpen,
    rightOpen,
    onToggleLeft,
    onToggleRight,
  } = props;

  const scrollRef = useRef<HTMLDivElement>(null);
  const stickRef = useRef(true);
  const reducedMotion = usePrefersReducedMotion();

  /** Stay pinned to the newest message unless the user scrolled up to read. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reducedMotion ? "auto" : "smooth" });
  }, [messages, reducedMotion]);

  function handleScroll(): void {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickRef.current = distance < 140;
  }

  const showFollowUps = !generating && messages.some((m) => m.status === "done") && followUps.length > 0;
  const empty = messages.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex h-13 items-center justify-between gap-2 border-b border-border bg-surface/40 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleLeft}
            aria-label={leftOpen ? "Hide learning context" : "Show learning context"}
            aria-pressed={leftOpen}
            icon={<PanelLeft className="h-4 w-4" aria-hidden />}
            className="hidden lg:inline-flex"
          />
          <h2 className="truncate text-[0.9375rem] font-semibold">AI Tutor</h2>
          <div className="hidden min-w-0 flex-wrap gap-1.5 sm:flex" aria-hidden>
            {chips.map((chip) => (
              <Badge key={chip} tone="neutral">
                {chip}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            aria-label="New chat — clears the conversation"
            icon={<MessageSquarePlus className="h-4 w-4" aria-hidden />}
            className="lg:hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleRight}
            aria-label={rightOpen ? "Hide code workspace" : "Show code workspace"}
            aria-pressed={rightOpen}
            icon={<PanelRight className="h-4 w-4" aria-hidden />}
            className="hidden lg:inline-flex"
          />
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6"
      >
        {empty ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col justify-center">
            <div className="flex items-start gap-3">
              <CodeMentorAvatar />
              <div>
                <h3 className="text-base font-semibold">What are we learning today?</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">
                  Pick a language and skill level on the left, then ask anything. I adapt my explanations to your
                  level — and I never pretend to have executed your code.
                </p>
                <ul className="mt-3 space-y-1.5 text-[0.8125rem] text-muted">
                  <li>
                    <span className="mr-2 font-mono text-xs text-accent">01</span>Pick a language, level and tutoring
                    mode
                  </li>
                  <li>
                    <span className="mr-2 font-mono text-xs text-accent">02</span>Ask a question or paste an error
                  </li>
                  <li>
                    <span className="mr-2 font-mono text-xs text-accent">03</span>Practice in the code workspace and
                    request a review
                  </li>
                </ul>
              </div>
            </div>
            {followUps.length > 0 ? <FollowUpChips items={followUps.slice(0, 3)} onPick={onPickFollowUp} /> : null}
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6" role="log" aria-label="Conversation">
            {messages.map((message) => (
              <ChatMessageItem key={message.id} message={message} onRetry={() => onRetryMessage(message.id)} />
            ))}
            {showFollowUps ? <FollowUpChips items={followUps} onPick={onPickFollowUp} /> : null}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-surface/40 p-3 sm:p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput value={input} onChange={onInputChange} onSend={onSend} onStop={onStop} generating={generating} />
        </div>
      </div>
    </div>
  );
}
