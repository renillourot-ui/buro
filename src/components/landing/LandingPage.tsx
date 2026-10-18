"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Bug, GraduationCap, Route, Sparkles, Code2, Trophy, Lightbulb, BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { LearningPathCard } from "@/components/learning/LearningPathCard";
import { COURSES } from "@/data/courses";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Programming Tutor",
    text: "A patient instructor that adapts to your level and language. Streaming answers, examples, line-by-line walkthroughs and practice exercises.",
  },
  {
    icon: Bug,
    title: "Smart Debugging Assistant",
    text: "Paste code plus the error message and get structured analysis: the likely problem, why it happens, a fix, and prevention tips.",
  },
  {
    icon: Code2,
    title: "Interactive Code Editor",
    text: "A real Monaco editor with syntax highlighting for JavaScript, TypeScript, Python, HTML and CSS — plus honest AI code review.",
  },
  {
    icon: Route,
    title: "Guided Learning Paths",
    text: "Six structured paths, 56 written lessons: objectives, explanations, annotated code, mistakes, quizzes and exercises.",
  },
  {
    icon: Trophy,
    title: "Coding Challenges",
    text: "Solve problems in the editor. JavaScript challenges run deterministic local tests; everything gets honest AI feedback.",
  },
  {
    icon: Lightbulb,
    title: "Beginner-Friendly Explanations",
    text: "An “Explain like I'm a beginner” switch that trades jargon for analogies — plus three skill levels across every mode.",
  },
];

const STEPS = [
  { title: "Choose a language", text: "JavaScript, TypeScript, Python, HTML, CSS — or general programming questions." },
  { title: "Ask the AI a question", text: "Concepts, errors, code snippets or assignments — in your own words." },
  { title: "Understand the explanation", text: "Simple first, then technical details, examples and line-by-line notes." },
  { title: "Practice with code", text: "Reproduce the idea in the built-in workspace or solve a challenge." },
  { title: "Improve through feedback", text: "Request a review, get issues ranked by severity, and iterate — verify anything before shipping." },
];

export function LandingPage() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero entrance
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-eyebrow", { y: 14, opacity: 0, duration: 0.5 }, 0.05)
          .from(".hero-title span", { y: 26, opacity: 0, duration: 0.7, stagger: 0.09 }, 0.15)
          .from(".hero-copy", { y: 22, opacity: 0, duration: 0.6 }, 0.4)
          .from(".hero-actions > *", { y: 16, opacity: 0, duration: 0.5, stagger: 0.08 }, 0.55)
          .from(".hero-note", { opacity: 0, duration: 0.5 }, 0.7)
          .from(".preview-frame", { y: 28, opacity: 0, duration: 0.8 }, 0.35)
          .from(".preview-line", { x: -10, opacity: 0, duration: 0.4, stagger: 0.12 }, 0.7)
          .from(".preview-ai", { y: 16, opacity: 0, scale: 0.97, duration: 0.5 }, 1.5);

        // Scroll-triggered reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
          gsap.from(group.children, {
            y: 26,
            opacity: 0,
            duration: 0.6,
            stagger: 0.09,
            ease: "power2.out",
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  return (
    <main ref={rootRef}>
      {/* ───────────────────────────── hero ───────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pb-24">
          <div>
            <p className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-soft px-3 py-1 text-[0.6875rem] font-semibold tracking-widest text-accent-hover uppercase">
              <Sparkles className="h-3 w-3" aria-hidden />
              Keyless, setup-free, storage-free AI tutor
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              <span className="hero-title inline">
                <span className="block">Learn to Code.</span>
                <span className="block bg-gradient-to-r from-accent to-violet bg-clip-text text-transparent">
                  Understand Every Line.
                </span>
              </span>
            </h1>
            <p className="hero-copy mt-5 max-w-xl text-[0.9375rem] leading-7 text-muted sm:text-base">
              Your personal AI programming tutor helps you understand programming concepts, solve problems, debug
              errors, and become a better developer — one step at a time.
            </p>
            <div className="hero-actions mt-7 flex flex-wrap items-center gap-3">
              <LinkButton href="/tutor" size="lg" icon={<ArrowRight className="h-4 w-4" aria-hidden />}>
                Start Learning Free
              </LinkButton>
              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-raised px-6 text-[0.9375rem] font-medium transition-colors hover:border-border-strong hover:bg-hover"
              >
                Explore Features
              </a>
            </div>
            <p className="hero-note mt-4 text-[0.75rem] text-faint">
              No account. No sign-up. Your conversation lives only in this tab&apos;s memory and disappears when you leave.
            </p>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* ─────────────────────────── features ─────────────────────────── */}
      <section id="features" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div data-reveal>
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">Features</p>
            <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
              A tutor that behaves like one
            </h2>
          </div>
          <div data-reveal-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── how it works ─────────────────────── */}
      <section id="how-it-works" className="border-b border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div data-reveal>
            <p className="text-xs font-semibold tracking-widest text-accent uppercase">How it works</p>
            <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">One loop, repeated daily</h2>
          </div>
          <ol data-reveal-stagger className="mt-10 grid gap-4 lg:grid-cols-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="panel relative p-5">
                <span className="font-mono text-[0.6875rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-[0.9375rem] font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-5 text-muted">{step.text}</p>
                {i < STEPS.length - 1 ? (
                  <span className="absolute -right-2.5 top-1/2 hidden h-5 w-5 -translate-y-1/2 items-center justify-center text-faint lg:flex" aria-hidden>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────────────────────── learning paths ───────────────────── */}
      <section id="learning-paths" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest text-accent uppercase">Learning paths</p>
              <h2 className="mt-2 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
                Structured lessons, written to be read
              </h2>
              <p className="mt-2 max-w-2xl text-[0.9375rem] leading-7 text-muted">
                Each path is a sequence of complete lessons — objectives, annotated examples, common mistakes, quizzes
                and practice.
              </p>
            </div>
            <Link
              href="/learning-paths"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-hover hover:underline"
            >
              Browse all paths
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div data-reveal-stagger className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {COURSES.map((course) => (
              <LearningPathCard key={course.slug} course={course} />
            ))}
          </div>
          <p data-reveal className="mt-5 text-[0.75rem] text-faint">
            Lesson completion markers on lesson pages are session-only and reset on refresh — this app keeps no
            progress records of any kind.
          </p>
        </div>
      </section>

      {/* ─────────────────────────── final CTA ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div data-reveal className="panel relative overflow-hidden p-10 text-center sm:p-14">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute left-1/2 top-0 h-64 w-[560px] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px]" />
          </div>
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Stop memorizing code. Start understanding it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.9375rem] leading-7 text-muted">
              Open the tutor, ask your first question, and watch the answer build up line by line — explanations you
              can actually learn from.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LinkButton href="/tutor" size="lg" icon={<GraduationCap className="h-4 w-4" aria-hidden />}>
                Start Learning
              </LinkButton>
              <LinkButton href="/challenges" size="lg" variant="secondary" icon={<BookOpenCheck className="h-4 w-4" aria-hidden />}>
                Try a challenge first
              </LinkButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Sparkles;
  title: string;
  text: string;
}) {
  return (
    <article className="panel group h-full p-5 transition-colors hover:border-border-strong hover:bg-hover" data-feature>
      <span className="flex size-10 items-center justify-center rounded-xl border border-accent-border bg-accent-soft text-accent-hover" aria-hidden>
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-[0.9375rem] font-semibold group-hover:text-accent-hover">{title}</h3>
      <p className="mt-1.5 text-[0.8125rem] leading-6 text-muted">{text}</p>
    </article>
  );
}

const PREVIEW_LINES: Array<Array<{ text: string; cls?: string }>> = [
  [
    { text: "function " , cls: "text-[#b4a0ff]" },
    { text: "describe", cls: "text-[#7dd3fc]" },
    { text: "(value) {" },
  ],
  [
    { text: "  const type", cls: "" },
    { text: " = ", cls: "text-[#98a1b4]" },
    { text: "Array", cls: "text-[#7dd3fc]" },
    { text: ".isArray(value) ? 'array' : typeof value", cls: "text-[#8fd49a]" },
  ],
  [{ text: "  return `${type} — inspect before changing it`", cls: "" }, { text: ";", cls: "text-[#98a1b4]" }],
  [{ text: "}" }],
  [{ text: "" }],
  [{ text: "describe", cls: "text-[#7dd3fc]" }, { text: "([1, 2, 3]);", cls: "text-[#8fd49a]" }, { text: "  // 'array — inspect…'" }],
];

function HeroPreview() {
  return (
    <div className="preview-frame panel overflow-hidden shadow-pop" aria-hidden>
      <div data-testid="ai-preview">
        <div className="flex items-center gap-2 border-b border-border bg-surface/80 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
          <span className="ml-2 font-mono text-[0.6875rem] text-faint">tutor-preview.js</span>
        </div>
        <div className="space-y-2.5 bg-code-bg px-4 py-4 font-mono text-[0.8125rem] leading-6">
          {PREVIEW_LINES.map((line, i) => (
            <p key={i} className="preview-line flex gap-3 whitespace-pre">
              <span className="w-4 shrink-0 text-right text-faint/60 select-none">{i + 1}</span>
              <span className="text-ink/90">
                {line.map((part, j) => (
                  <span key={j} className={part.cls ?? ""}>
                    {part.text}
                  </span>
                ))}
              </span>
            </p>
          ))}
        </div>
        <div className="preview-ai m-4 rounded-xl border border-accent-border bg-accent-soft p-4" data-testid="ai-explanation">
          <p className="flex items-center gap-2 text-[0.6875rem] font-semibold tracking-widest text-accent-hover uppercase">
            <Sparkles className="h-3 w-3" aria-hidden />
            CodeMentor explains
          </p>
          <p className="mt-2 text-[0.8125rem] leading-6 text-ink/90">
            This function takes anything, labels it as <span className="font-mono text-[0.75rem] text-accent-hover">&quot;array&quot;</span>{" "}
            or a plain type string, and returns a friendly description. The{" "}
            <span className="font-mono text-[0.75rem] text-accent-hover">typeof</span> operator can&apos;t tell arrays apart
            from objects — that&apos;s why the explicit check comes first.
          </p>
          <p className="mt-2 text-[0.75rem] text-muted">
            ▸ Watch out: <span className="font-mono text-[0.7rem]">typeof null</span> is{" "}
            <span className="font-mono text-[0.7rem]">&quot;object&quot;</span> — the classic JavaScript trap.
          </p>
        </div>
      </div>
    </div>
  );
}
