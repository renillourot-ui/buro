"use client";

import { Sparkles } from "lucide-react";

export function FollowUpChips({ items, onPick }: { items: string[]; onPick: (text: string) => void }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-6" aria-label="Suggested follow-up questions">
      <p className="mb-2 flex items-center gap-1.5 text-[0.6875rem] font-semibold tracking-widest text-faint uppercase">
        <Sparkles className="h-3 w-3 text-accent" aria-hidden />
        Try asking
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            className="rounded-full border border-border bg-raised px-3 py-1.5 text-[0.8125rem] text-muted transition-colors hover:border-accent-border hover:bg-accent-soft hover:text-accent-hover"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
