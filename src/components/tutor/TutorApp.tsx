"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { postAnalysis, networkError, streamChat, chatPayload } from "@/lib/api-client";
import { recordAiInteraction, recordChatStarted } from "@/lib/session/progress-store";
import { takeCodeHandoff } from "@/lib/session/handoff";
import { templateFor } from "@/data/templates";
import { SUGGESTED_TOPICS } from "@/data/prompts";
import { languageMeta, type ChatMessage, type CodeLanguage, type SkillLevel, type TutorLanguage, type TutorMode } from "@/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ContextSidebar } from "./ContextSidebar";
import { TutorChat } from "./TutorChat";
import { CodeWorkspace } from "./CodeWorkspace";
import { SegmentedControl } from "@/components/ui/Controls";
import type { ReviewState } from "./types";
import { cn } from "@/lib/utils/cn";

type MobileTab = "chat" | "code" | "setup";

interface Generation {
  id: number;
  controller: AbortController;
  assistantId: string;
}

const DISCUSS_CODE_LIMIT = 2600;

/**
 * Tutor workspace — the primary product surface.
 *
 * Chat rules (non-negotiable):
 * - All messages live in React state of THIS component tree only.
 * - `New Chat`, a full refresh, or leaving `/tutor` and returning ⇒ a
 *   completely empty conversation. Nothing is restored from anywhere: no
 *   browser storage, no server history, no shared global store.
 * - An in-flight generation holds an AbortController + a generation id; a
 *   reset aborts the request and stale chunks can never reappear.
 */
export function TutorApp() {
  const reducedMotion = usePrefersReducedMotion();

  /* ------------------------------ learning context ------------------------ */
  const [language, setLanguage] = useState<TutorLanguage>("javascript");
  const [level, setLevel] = useState<SkillLevel>("intermediate");
  const [mode, setMode] = useState<TutorMode>("learn");
  const [beginner, setBeginner] = useState(true);

  /* ------------------------------ chat state ------------------------------ */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);

  const messagesRef = useRef<ChatMessage[]>([]);

  const genRef = useRef<Generation | null>(null);
  const idRef = useRef(0);
  const bufferRef = useRef("");
  const flushRef = useRef<number | null>(null);
  const chatRef = useRef<HTMLElement>(null);

  // Pointer to the latest messages, synced outside render (needed by send/retry handlers).
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /* ------------------------------ code workspace -------------------------- */
  const [workspaceLanguage, setWorkspaceLanguage] = useState<CodeLanguage>("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<Partial<Record<CodeLanguage, string>>>({});
  const code = codeByLanguage[workspaceLanguage] ?? templateFor(workspaceLanguage);
  const setWorkspaceCode = (next: string): void => {
    setCodeByLanguage((prev) => ({ ...prev, [workspaceLanguage]: next }));
  };

  const [review, setReview] = useState<ReviewState>({ status: "idle" });
  const reviewAbortRef = useRef<AbortController | null>(null);

  /* ------------------------------ layout ---------------------------------- */
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("chat");
  const leftRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLElement>(null);

  /* GSAP accent transitions when desktop panels appear. Reduced-motion safe. */
  useEffect(() => {
    if (reducedMotion) return;
    const pairs: Array<[HTMLElement | null, boolean, number]> = [
      [leftRef.current, leftOpen, -14],
      [rightRef.current, rightOpen, 14],
    ];
    for (const [el, visible, x] of pairs) {
      if (!el || !visible) continue;
      const display = window.getComputedStyle(el).display;
      if (display === "none") continue;
      gsap.fromTo(el, { opacity: 0.4, x }, { opacity: 1, x: 0, duration: 0.25, ease: "power2.out", overwrite: "auto" });
    }
  }, [leftOpen, rightOpen, reducedMotion]);

  /* One-time handoff from the debugger / challenges / lessons (memory only).
     Handoff is consumed exactly once per page load; the rAF applies it (also
     under StrictMode's double effect run) and keeps useState out of the
     effect body. */
  useEffect(() => {
    const handoff = takeCodeHandoff();
    if (!handoff) return;
    requestAnimationFrame(() => {
      setWorkspaceLanguage(handoff.language === "general" ? "javascript" : handoff.language);
      if (handoff.code) {
        setCodeByLanguage((prev) => ({ ...prev, [handoff.language]: handoff.code }));
      }
      if (handoff.question) setInput(handoff.question);
      setRightOpen(true);
    });
  }, []);

  /* ------------------------------ chat generation ------------------------- */

  const flushBuffer = (assistantId: string): void => {
    if (flushRef.current !== null) {
      window.clearTimeout(flushRef.current);
      flushRef.current = null;
    }
    const text = bufferRef.current;
    bufferRef.current = "";
    if (!text) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + text, status: "streaming" } : m)),
    );
  };

  const patchAssistant = (assistantId: string, patch: Partial<ChatMessage>): void => {
    setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, ...patch } : m)));
  };

  function startGeneration(userContent: string, baseMessages: ChatMessage[]): void {
    if (genRef.current) return; // never submit while a request is in flight
    const genId = ++idRef.current;
    const assistantId = `assistant-${genId}`;

    setMessages([
      ...baseMessages,
      { id: `user-${genId}`, role: "user", content: userContent, status: "done" },
      { id: assistantId, role: "assistant", content: "", status: "pending" },
    ]);
    setInput("");

    bufferRef.current = "";
    if (flushRef.current !== null) {
      window.clearTimeout(flushRef.current);
      flushRef.current = null;
    }

    const controller = new AbortController();
    genRef.current = { id: genId, controller, assistantId };
    setGenerating(true);
    recordChatStarted();
    recordAiInteraction("chat", "Started a tutor conversation");

    const history = baseMessages
      .filter((m) => m.status === "done" || m.status === "stopped")
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    streamChat(
      chatPayload(history, userContent, { language, level, mode, beginner }),
      controller.signal,
      (text) => {
        bufferRef.current += text;
        if (flushRef.current === null) {
          flushRef.current = window.setTimeout(() => flushBuffer(assistantId), 45);
        }
      },
    )
      .then((meta) => {
        flushBuffer(assistantId);
        if (genRef.current?.id === genId) {
          patchAssistant(assistantId, { status: "done", error: undefined, servedModel: meta.model || undefined });
        }
      })
      .catch((err: unknown) => {
        flushBuffer(assistantId);
        const apiError = networkError(err);
        if (genRef.current?.id === genId) {
          if (apiError.code === "aborted") {
            // User pressed Stop — keep the partial answer, honestly marked.
            patchAssistant(assistantId, { status: "stopped", error: undefined });
          } else {
            patchAssistant(assistantId, { status: "error", error: apiError.message });
          }
        }
      })
      .finally(() => {
        if (genRef.current?.id === genId) {
          genRef.current = null;
          setGenerating(false);
        }
      });
  }

  const handleSend = (): void => {
    if (generating) return;
    const content = input.trim();
    if (!content) return;
    startGeneration(content, messagesRef.current);
  };

  const handleStop = (): void => {
    genRef.current?.controller.abort();
  };

  /** New Chat: abort in-flight work and wipe everything, immediately. */
  const handleNewChat = (): void => {
    genRef.current?.controller.abort();
    genRef.current = null;
    if (flushRef.current !== null) {
      window.clearTimeout(flushRef.current);
      flushRef.current = null;
    }
    bufferRef.current = "";
    reviewAbortRef.current?.abort();
    reviewAbortRef.current = null;
    setReview({ status: "idle" });
    setMessages([]);
    setInput("");
    setGenerating(false);
    setMobileTab("chat");
  };

  const handleRetry = (assistantId: string): void => {
    if (genRef.current) return;
    const history = messagesRef.current;
    const index = history.findIndex((m) => m.id === assistantId);
    if (index < 0) return;
    const lastUser = [...history.slice(0, index)].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    const base = history.filter((m) => m.id !== assistantId && m.id !== lastUser.id);
    startGeneration(lastUser.content, base);
  };

  /* ------------------------------ code review ------------------------------ */

  const requestReview = async (): Promise<void> => {
    if (review.status === "loading") return;
    if (!code.trim()) return;
    reviewAbortRef.current?.abort();
    const controller = new AbortController();
    reviewAbortRef.current = controller;
    setReview({ status: "loading" });
    setMobileTab("code");
    try {
      const result = await postAnalysis(
        "/api/tutor/review-code",
        { code, language: workspaceLanguage, level, question: undefined },
        controller.signal,
      );
      if (reviewAbortRef.current !== controller) return; // stale guard
      setReview({ status: "done", result: { feedback: result.feedback, servedModel: result.servedModel } });
      recordAiInteraction("review", "Requested an AI code review");
    } catch (err) {
      if (reviewAbortRef.current !== controller) return;
      const apiError = networkError(err);
      setReview(apiError.code === "aborted" ? { status: "idle" } : { status: "error", error: apiError.message });
    } finally {
      if (reviewAbortRef.current === controller) reviewAbortRef.current = null;
    }
  };

  const handleDiscussCode = (): void => {
    const snippet =
      code.length > DISCUSS_CODE_LIMIT ? `${code.slice(0, DISCUSS_CODE_LIMIT)}\n// … (trimmed)` : code;
    setInput(
      `Please explain what this ${workspaceLanguage} code does, line by line, and point out any mistakes:\n\n\`\`\`${workspaceLanguage}\n${snippet}\n\`\`\``,
    );
    setMobileTab("chat");
  };

  /* ------------------------------ derived UI ------------------------------- */

  const meta = languageMeta(language);
  const chips = useMemo(
    () => [meta.label, level.charAt(0).toUpperCase() + level.slice(1), `${mode.charAt(0).toUpperCase() + mode.slice(1)} mode`],
    [meta.label, level, mode],
  );

  const followUps = useMemo(() => {
    if (generating) return [];
    const topics = SUGGESTED_TOPICS[language];
    return mode === "challenge"
      ? [...topics.slice(2, 4), "Give me a small challenge with starter code.", "Stand by with hints — I'll attempt it first."]
      : topics.slice(0, 4);
  }, [generating, language, mode]);

  /* ------------------------------ render ---------------------------------- */

  const workspaceProps = {
    language: workspaceLanguage,
    code,
    onLanguageChange: setWorkspaceLanguage,
    onCodeChange: setWorkspaceCode,
    onReset: () => setWorkspaceCode(templateFor(workspaceLanguage)),
    review,
    onReview: requestReview,
    onRetryReview: requestReview,
    onDiscussCode: handleDiscussCode,
  } as const;

  const sidebarProps = {
    language,
    onLanguageChange: setLanguage,
    level,
    onLevelChange: setLevel,
    mode,
    onModeChange: setMode,
    beginner,
    onBeginnerChange: setBeginner,
    generating,
    onNewChat: handleNewChat,
    onPickPrompt: (prompt: string) => {
      setInput(prompt);
      setMobileTab("chat");
    },
  } as const;

  const chatProps = {
    messages,
    input,
    onInputChange: setInput,
    onSend: handleSend,
    onStop: handleStop,
    generating,
    followUps,
    onPickFollowUp: (text: string) => setInput(text),
    onRetryMessage: handleRetry,
    chips,
    onNewChat: handleNewChat,
    leftOpen,
    rightOpen,
    onToggleLeft: () => setLeftOpen((v) => !v),
    onToggleRight: () => setRightOpen((v) => !v),
  } as const;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] min-h-[540px] w-full max-w-[1800px] overflow-hidden px-0">
      {/* Left — learning context */}
      <aside
        ref={leftRef}
        aria-label="Learning context"
        className={cn("border-r border-border bg-surface/40", mobileTab === "setup" ? "block w-full" : "hidden", "lg:block lg:w-[280px]")}
      >
        <ContextSidebar {...sidebarProps} />
      </aside>

      {/* Center — conversation + mobile tabs */}
      <section ref={chatRef} aria-label="AI conversation" className={cn("flex min-w-0 flex-1 flex-col", mobileTab !== "chat" && "max-lg:hidden")}>
        <div className="min-h-0 flex-1">
          <TutorChat {...chatProps} />
        </div>
        <nav aria-label="Mobile workspace tabs" className="shrink-0 border-t border-border bg-surface/60 p-2 lg:hidden">
          <SegmentedControl
            className="flex w-full"
            size="md"
            value={mobileTab}
            options={[
              { value: "chat", label: "Chat" },
              { value: "code", label: "Code" },
              { value: "setup", label: "Context" },
            ]}
            onChange={(v) => setMobileTab(v as MobileTab)}
          />
        </nav>
      </section>

      {/* Right — code workspace */}
      <aside
        ref={rightRef}
        aria-label="Code workspace"
        className={cn("border-l border-border bg-surface/40", mobileTab === "code" ? "block w-full" : "hidden", "lg:block lg:w-[440px]")}
      >
        <CodeWorkspace {...workspaceProps} />
      </aside>
    </div>
  );
}
