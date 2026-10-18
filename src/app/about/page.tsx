import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = {
  title: "About",
  description: "How CodeMentor AI works: the AI backend, privacy model, tech stack and honest limitations.",
};

const stack = [
  "Next.js App Router",
  "TypeScript",
  "React 19",
  "Tailwind CSS v4",
  "GSAP + ScrollTrigger",
  "Monaco Editor",
  "Lucide icons",
  "React Markdown",
  "Zod validation",
  "Node.js route handlers",
];

const limits = [
  "AI responses can be wrong — verify anything you ship with your own tools.",
  "The code workspace analyzes code; it does not execute it. JavaScript challenge tests run locally in your browser, and only if you press Run tests.",
  "The in-memory rate limiter counts per server process; on multi-instance deployments quotas are approximate.",
  "Progress, quiz answers and reviews are session-only on purpose. Nothing persists, by design.",
];

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="About this project"
        title="CodeMentor AI"
        description="A complete, database-free AI programming tutor: chat tutor, debugging assistant, static learning paths, coding challenges and honest session-only progress tracking."
        actions={<LinkButton href="/tutor">Open the tutor</LinkButton>}
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <div className="prose-tutor space-y-10">
          <section>
            <h2>The idea</h2>
            <p>
              Most coding help online hands you a snippet and a shrug. CodeMentor AI is built around the opposite
              premise: a tutor should teach — start simple, add technical depth, show an example, walk it line by
              line, name the common mistakes, and leave you a practice exercise.
            </p>
            <p>
              The app keeps that promise with three concrete surfaces: a conversational <Link href="/tutor">AI
              tutor</Link> with Learn, Debug and Challenge modes, a separate <Link href="/debugger">debugging
              assistant</Link> with a structured diagnosis format, and <Link href="/challenges">coding
              challenges</Link> reviewed with deterministic local tests where possible.
            </p>
          </section>

          <section id="ai">
            <h2>How the AI works</h2>
            <p>
              The backend is a thin, stateless layer of Next.js route handlers. It ships with a failover chain of
              free, keyless, OpenAI-compatible community endpoints (configuration matching the bundled reference
              client <code className="rounded bg-raised px-1.5 py-0.5 font-mono text-[0.8em]">ai_client.py</code>):
            </p>
            <ol className="ml-5 mt-2 list-decimal space-y-1.5 text-[0.9375rem]">
              <li>
                <strong>Vireonix</strong> — model <code className="font-mono text-[0.85em]">auto</code>, generous per-IP
                hourly quotas
              </li>
              <li>
                <strong>Murakumo free lane</strong> — model <code className="font-mono text-[0.85em]">murakumo/free</code>{" "}
                (2 048-token cap on the public route)
              </li>
              <li>
                <strong>Murakumo mishima</strong> — larger-context fleet model
              </li>
            </ol>
            <p>
              If one endpoint fails or returns empty output, the next one is tried automatically. With no key, no
              account and no database anywhere, the tutor works out of the box. Own OpenAI-compatible provider? Set
              <code className="mx-1 rounded bg-raised px-1.5 py-0.5 font-mono text-[0.8em]">AI_BASE_URL</code>,
              <code className="mx-1 rounded bg-raised px-1.5 py-0.5 font-mono text-[0.8em]">AI_API_KEY</code> (kept
              strictly server-side) and
              <code className="mx-1 rounded bg-raised px-1.5 py-0.5 font-mono text-[0.8em]">AI_MODEL</code> in
              <code className="mx-1 rounded bg-raised px-1.5 py-0.5 font-mono text-[0.8em]">.env.local</code>. Missing
              configuration produces an explicit error — never a fabricated answer.
            </p>
            <div className="my-4 flex flex-wrap gap-2">
              <Badge tone="success">Streaming responses</Badge>
              <Badge tone="info">Zod-validated requests</Badge>
              <Badge tone="warning">Honest error states</Badge>
              <Badge tone="neutral">Rate-limited endpoints</Badge>
            </div>
          </section>

          <section id="privacy">
            <h2>Privacy &amp; data</h2>
            <p>
              This project deliberately stores nothing:
            </p>
            <ul className="ml-5 mt-2 list-disc space-y-1.5 text-[0.9375rem]">
              <li>No database of any kind, no ORM, no storage adapters, no auth system.</li>
              <li>Chat messages live only in React state while the tutor page is open. A refresh, a navigation away-and-back, or «New Chat» clears them — nothing restores them.</li>
              <li>In-flight requests can be stopped mid-stream; stale responses are aborted and can never reappear.</li>
              <li>When you send a message, the current conversation (from React state) is posted to the AI endpoint once to generate the reply. It is not written to files, not logged, and not cached.</li>
              <li>Progress indicators are session-only and computed from client memory.</li>
            </ul>
          </section>

          <section>
            <h2>Built with</h2>
            <div className="my-3 flex flex-wrap gap-2">
              {stack.map((item) => (
                <Badge key={item} tone="neutral">
                  {item}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h2>Honest limitations</h2>
            <ul className="ml-5 mt-2 list-disc space-y-1.5 text-[0.9375rem] text-muted">
              {limits.map((limit) => (
                <li key={limit}>{limit}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
