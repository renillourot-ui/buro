import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)} aria-label="CodeMentor AI home">
      <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-bg shadow-panel" aria-hidden>
        <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6 4 12l5 6" />
          <path d="m15 6 5 6-5 6" />
        </svg>
      </span>
      <span className="text-[0.95rem] font-semibold tracking-tight text-ink">
        CodeMentor<span className="text-accent"> AI</span>
      </span>
    </Link>
  );
}
