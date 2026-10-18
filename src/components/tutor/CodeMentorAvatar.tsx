export function CodeMentorAvatar() {
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-accent-border bg-accent-soft text-accent-hover"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6 4 12l5 6" />
        <path d="m15 6 5 6-5 6" />
        <path d="M13.5 5.5 10.5 18.5" strokeWidth="1.8" />
      </svg>
    </span>
  );
}
