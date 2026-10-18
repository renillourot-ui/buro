"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BookOpenCheck, BrainCircuit, MessageSquareText, ScanSearch, Trash2, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Badge";
import {
  clearSessionProgress,
  getSnapshot,
  subscribe,
  type ActivityEvent,
} from "@/lib/session/progress-store";

export function ProgressClient() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [confirmReset, setConfirmReset] = useState(false);

  const lessonCount = Object.keys(state.lessons).length;
  const attempted = Object.values(state.challenges).filter((c) => c.attempts > 0).length;
  const passed = Object.values(state.challenges).filter((c) => c.lastStatus === "tests-passed").length;
  const empty = lessonCount === 0 && attempted === 0 && state.chatsStarted === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
      <div className="panel mb-6 flex flex-wrap items-center gap-3 p-4">
        <BrainCircuit className="h-5 w-5 text-accent" aria-hidden />
        <p className="flex-1 text-[0.8125rem] leading-6 text-muted">
          <span className="font-semibold text-ink">Session-only data.</span> These counters live in React memory for
          the current browser session. Refreshing the page, closing the tab or starting a new session resets
          everything — this app has no database and no storage of any kind.
        </p>
        <Button variant="danger-ghost" size="sm" icon={<Trash2 className="h-4 w-4" aria-hidden />} onClick={() => setConfirmReset(true)}>
          Clear session data
        </Button>
      </div>

      {empty ? (
        <div className="panel">
          <EmptyState
            icon={<Zap className="h-5 w-5" />}
            title="No session activity yet"
            description="Open a lesson, start a tutor chat, request a review, analyze a bug or attempt a challenge — anything you do in this browser session shows up here."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/tutor" className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent-hover">
                  Talk to the tutor
                </Link>
                <Link href="/learning-paths" className="rounded-lg border border-border bg-raised px-4 py-2 text-sm font-medium hover:bg-hover">
                  Start a learning path
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="space-y-4">
            <StatCard icon={<BookOpenCheck className="h-4 w-4" />} label="Lessons completed this session" value={lessonCount} to="/learning-paths" linkLabel="Browse lessons" />
            <StatCard icon={<Trophy className="h-4 w-4" />} label="Challenges attempted" value={attempted} to="/challenges" linkLabel="Open challenges" />
            <StatCard icon={<Zap className="h-4 w-4" />} label="Passed local test suites" value={passed} />
            <StatCard icon={<MessageSquareText className="h-4 w-4" />} label="Tutor conversations started" value={state.chatsStarted} />
          </div>

          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
              <h2 className="text-[0.9375rem] font-semibold">Recent activity</h2>
              <Badge tone="neutral">this session only</Badge>
            </div>
            {state.activities.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<ScanSearch className="h-5 w-5" />}
                  title="Nothing recorded yet"
                  description="Activity appears as soon as you complete a lesson, attempt a challenge, or use the AI tools."
                />
              </div>
            ) : (
              <ol className="divide-y divide-border">
                {state.activities.map((event) => (
                  <ActivityRow key={event.id} event={event} />
                ))}
              </ol>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Clear session data?"
        description="Removes all in-memory session indicators from this page state (lessons, challenges, activity, conversation count). Nothing was ever stored anywhere else."
        confirmLabel="Clear"
        destructive
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          clearSessionProgress();
          setConfirmReset(false);
        }}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  to,
  linkLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="panel flex items-center gap-3 p-4">
      <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-raised text-accent-hover" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-2xl font-semibold leading-7">{value}</p>
        <p className="truncate text-[0.75rem] text-muted">{label}</p>
      </div>
      {to ? (
        <Link href={to} className="shrink-0 text-[0.75rem] font-medium text-accent-hover hover:underline">
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

const ICON_FOR: Record<ActivityEvent["type"], React.ComponentType<{ className?: string }>> = {
  lesson: BookOpenCheck,
  challenge: Trophy,
  chat: MessageSquareText,
  review: ScanSearch,
  debug: BrainCircuit,
};

function ActivityRow({ event }: { event: ActivityEvent }) {
  const Icon = ICON_FOR[event.type] ?? Zap;
  const time = new Date(event.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-raised text-muted" aria-hidden>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.875rem] font-medium">{event.label}</p>
        {event.detail ? <p className="truncate text-[0.6875rem] text-faint">{event.detail}</p> : null}
      </div>
      <time dateTime={new Date(event.at).toISOString()} className="shrink-0 font-mono text-[0.6875rem] text-faint">
        {time}
      </time>
    </li>
  );
}
