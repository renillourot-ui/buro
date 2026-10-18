"use client";

import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import hljs from "highlight.js/lib/common";

/** Map fence ids onto highlight.js grammars. */
const LANG_ALIASES: Record<string, string> = {
  html: "xml",
  tsx: "typescript",
  jsx: "javascript",
  sh: "bash",
  shell: "bash",
  text: "plaintext",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function highlight(code: string, language?: string): string {
  const lang = LANG_ALIASES[language ?? ""] ?? language ?? "";
  try {
    if (lang && lang !== "plaintext" && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    }
  } catch {
    // fall through to escaped plain text
  }
  return escapeHtml(code);
}

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API can be unavailable — fall back to a hidden textarea.
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
      } finally {
        area.remove();
      }
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/80 px-2 py-1 text-[0.6875rem] font-medium text-muted transition-colors hover:border-border-strong hover:text-ink",
        className,
      )}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check className="h-3 w-3 text-success" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
      {copied ? "Copied" : label}
    </button>
  );
}

export function CodeBlock({
  code,
  language,
  title,
  className,
}: {
  code: string;
  language?: string;
  title?: string;
  className?: string;
}) {
  const html = useMemo(() => highlight(code, language), [code, language]);
  const label = LANG_ALIASES[language ?? ""] === undefined ? (language ?? "code") : (language ?? "code");

  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border bg-code-bg", className)}>
      {title ? (
        <figcaption className="flex items-center justify-between gap-2 border-b border-border bg-surface/60 px-3.5 py-2">
          <span className="truncate font-mono text-xs text-muted">{title}</span>
          <CopyButton text={code} />
        </figcaption>
      ) : (
        <div className="flex items-center justify-end gap-2 border-b border-border bg-surface/60 px-3 py-1.5">
          <span className="mr-auto font-mono text-[0.6875rem] text-faint">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}
