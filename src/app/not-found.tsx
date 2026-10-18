import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl border border-border bg-raised text-accent-hover" aria-hidden>
        <Compass className="h-6 w-6" />
      </span>
      <p className="mt-6 font-mono text-sm text-faint">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">This page ghosted the compiler</h1>
      <p className="mt-2 text-[0.9375rem] leading-7 text-muted">
        The route you requested doesn&apos;t exist — a classic off-by-one in the URL. Try one of the real destinations below.
      </p>
      <nav aria-label="Suggested pages" className="mt-8 flex flex-wrap justify-center gap-2">
        {[
          { href: "/", label: "Home" },
          { href: "/tutor", label: "AI Tutor" },
          { href: "/learning-paths", label: "Learning Paths" },
          { href: "/challenges", label: "Challenges" },
          { href: "/about", label: "About" },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg border border-border bg-raised px-4 py-2 text-sm font-medium transition-colors hover:border-border-strong hover:bg-hover"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
