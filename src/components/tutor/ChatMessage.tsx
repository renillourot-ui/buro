"use client";

import type { ChatMessage } from "@/types";
import { Markdown } from "@/components/editor/Markdown";
import { ErrorMessage } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { CodeMentorAvatar } from "./CodeMentorAvatar";

export function ChatMessageItem({
  message,
  onRetry,
}: {
  message: ChatMessage;
  onRetry?: () => void;
}) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md border border-border bg-raised px-4 py-2.5 text-[0.9375rem] leading-6">
          {message.content}
        </div>
      </div>
    );
  }

  const pending = message.status === "pending";
  const streaming = message.status === "streaming";

  return (
    <div className="flex gap-3">
      <CodeMentorAvatar />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[0.8125rem] font-semibold text-ink">CodeMentor AI</span>
          {message.servedModel ? <Badge tone="neutral">{message.servedModel}</Badge> : null}
        </div>

        <div className="mt-1.5">
          {pending ? (
            <div className="flex items-center gap-1.5 py-3" aria-live="polite" aria-label="CodeMentor is thinking">
              <span className="typing-dot" style={{ animationDelay: "0ms" }} />
              <span className="typing-dot" style={{ animationDelay: "150ms" }} />
              <span className="typing-dot" style={{ animationDelay: "300ms" }} />
              <span className="ml-2 text-xs text-faint">Thinking…</span>
            </div>
          ) : (
            <Markdown>
              {message.content ||
                (message.status === "error"
                  ? "_The tutor could not answer this request._"
                  : "_…_")}
            </Markdown>
          )}
          {streaming ? (
            <span className="ml-0.5 inline-block h-4 w-[0.55rem] translate-y-0.5 animate-blink rounded-[2px] bg-accent" aria-hidden />
          ) : null}
        </div>

        {message.status === "error" && message.error ? (
          <div className="mt-2 max-w-xl">
            <ErrorMessage title="The AI request failed" message={message.error} onRetry={onRetry} />
          </div>
        ) : null}

        {message.status === "stopped" ? (
          <p className="mt-1 text-xs text-faint">Generation stopped — this is a partial answer.</p>
        ) : null}
      </div>
    </div>
  );
}

/** Grouping wrapper — vertical rhythm between messages. */
export function MessageGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}
