"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

const PRIMARY_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/challenges", label: "Challenges" },
  { href: "/#how-it-works", label: "How It Works" },
];

const MOBILE_LINKS = [
  ...PRIMARY_LINKS,
  { href: "/tutor", label: "AI Tutor" },
  { href: "/debugger", label: "Debugging Assistant" },
  { href: "/progress", label: "Session Progress" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {PRIMARY_LINKS.map((link) =>
            link.href.startsWith("/#") ? (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-hover hover:text-ink"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:bg-hover",
                  pathname.startsWith(link.href) ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <LinkButton href="/tutor" size="sm" className="hidden sm:inline-flex">
            Start Learning
          </LinkButton>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted hover:bg-hover hover:text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4.5 w-4.5" aria-hidden /> : <Menu className="h-4.5 w-4.5" aria-hidden />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-nav" className="border-t border-border bg-surface md:hidden" onClickCapture={() => setOpen(false)}>
          <div className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:px-6">
            {MOBILE_LINKS.map((link) =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-hover hover:text-ink"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm hover:bg-hover",
                    pathname.startsWith(link.href) ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              ),
            )}
            <LinkButton href="/tutor" className="mt-1" ariaLabel="Start learning with the AI tutor">
              Start Learning
            </LinkButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
