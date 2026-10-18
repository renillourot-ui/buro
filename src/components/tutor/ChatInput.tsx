"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Kbd } from "@/components/ui/Feedback";
import { cn } from "@/lib/utils/cn";

const MAX_CHARS = 4000;

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  generating: boolean;
  disabled?: boolean;
}

/**
 * Chat composer. Enter sends, Shift+Enter adds a newline. While the AI is
 * generating, the send button becomes Stop and submissions are locked.
 */
export function ChatInput({ value, onChange, onSend, onStop, generating, disabled = false }: ChatInputProps) {
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea to its content (capped via CSS max-height).
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (!generating && !disabled) onSend();
    }
  }

  const blocked = generating || disabled;
  const remaining = MAX_CHARS - value.length;

  return (
    <div className="panel focus-within:border-accent/50 flex items-end gap-2 p-2 transition-colors">
      <label htmlFor="chat-input" className="sr-only">
        Ask CodeMentor AI a programming question
      </label>
      <textarea
        id="chat-input"
        ref={areaRef}
        rows={1}
        value={value}
        maxLength={MAX_CHARS}
        disabled={disabled}
        placeholder="Ask anything about programming…"
        onKeyDown={onKeyDown}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "max-h-[180px] min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[0.9375rem] leading-6 outline-none placeholder:text-faint",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      />
      {generating ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={onStop}
          icon={<Square className="h-3.5 w-3.5 fill-current" aria-hidden />}
          aria-label="Stop generating"
          className="mb-0.5 min-w-[4.5rem]"
        >
          Stop
        </Button>
      ) : (
        <Button
          size="sm"
          onClick={onSend}
          disabled={value.trim().length === 0 || disabled}
          icon={<Send className="h-3.5 w-3.5" aria-hidden />}
          aria-label="Send message"
          className="mb-0.5 min-w-[4rem]"
        >
          Send
        </Button>
      )}
      <p className={cn("mb-1.5 ml-1 hidden items-center gap-1.5 self-end text-[0.6875rem] text-faint sm:flex", blocked && "opacity-60")}>
        <Kbd>Enter</Kbd> send <Kbd>Shift</Kbd>+<Kbd>Enter</Kbd> newline
        {remaining <= 200 ? <span className="ml-2 text-warning">{remaining} left</span> : null}
      </p>
    </div>
  );
}
