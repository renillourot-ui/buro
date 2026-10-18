"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { loader } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type { CodeLanguage } from "@/types";
import { LoadingSkeleton } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <EditorLoading />,
});

function EditorLoading() {
  return (
    <div className="size-full space-y-2 p-4" aria-hidden>
      <LoadingSkeleton className="h-4 w-1/3" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-2/5" />
      <LoadingSkeleton className="h-4 w-1/2" />
      <LoadingSkeleton className="h-4 w-3/4" />
    </div>
  );
}

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
  fontSize: 13,
  lineHeight: 1.7,
  minimap: { enabled: false },
  wordWrap: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  padding: { top: 12, bottom: 12 },
  renderLineHighlight: "none",
  overviewRulerBorder: false,
  scrollbar: { verticalScrollbarSize: 9, horizontalScrollbarSize: 9 },
  fixedOverflowWidgets: true,
  smoothScrolling: true,
};

type Status = "loading" | "ready" | "fallback";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language: CodeLanguage;
  readOnly?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Monaco-based editor with a graceful offline fallback: if the Monaco CDN is
 * unreachable (or takes too long), a plain editable textarea is shown instead
 * of pretending syntax highlighting exists.
 */
export function CodeEditor({ value, onChange, language, readOnly = false, ariaLabel = "Code editor", className }: CodeEditorProps) {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    // Optional self-hosted/alternate Monaco CDN (non-secret, public asset path).
    const cdn = process.env.NEXT_PUBLIC_MONACO_CDN;
    if (cdn) {
      loader.config({ paths: { vs: cdn } });
    }

    let committed = false;
    const timeout = window.setTimeout(() => {
      // If Monaco hasn't arrived by now, commit to the plain-text fallback.
      committed = true;
      setStatus((s) => (s === "loading" ? "fallback" : s));
    }, 9000);

    loader
      .init()
      .then(() => {
        window.clearTimeout(timeout);
        if (!committed) setStatus("ready");
      })
      .catch(() => {
        window.clearTimeout(timeout);
        committed = true;
        setStatus("fallback");
      });

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className={cn("size-full overflow-hidden", className)} role="status" aria-label="Loading code editor">
        <EditorLoading />
      </div>
    );
  }

  if (status === "fallback") {
    return (
      <div className={cn("flex size-full min-h-0 flex-col", className)}>
        <p className="border-b border-border bg-warning/10 px-3 py-1.5 text-[0.6875rem] text-warning">
          Plain-text fallback editor (Monaco unavailable offline) — editing still works.
        </p>
        <label className="sr-only" htmlFor="code-fallback">
          {ariaLabel}
        </label>
        <textarea
          id="code-fallback"
          value={value}
          readOnly={readOnly}
          spellCheck={false}
          onChange={(e) => onChange?.(e.target.value)}
          className="size-full min-h-0 flex-1 resize-none bg-code-bg p-4 font-mono text-[0.8125rem] leading-6 text-ink/90 outline-none"
        />
      </div>
    );
  }

  return (
    <div className={cn("size-full min-h-0 overflow-hidden", className)}>
      <MonacoEditor
        height="100%"
        theme="codementor"
        language={language}
        value={value}
        onChange={(v) => onChange?.(v ?? "")}
        aria-label={ariaLabel}
        options={{ ...EDITOR_OPTIONS, readOnly }}
        beforeMount={(monaco) => {
          monaco.editor.defineTheme("codementor", {
            base: "vs-dark",
            inherit: true,
            rules: [{ token: "comment", foreground: "5f6675", fontStyle: "italic" }],
            colors: {
              "editor.background": "#0a0c10",
              "editorLineNumber.foreground": "#4b5364",
              "editorLineNumber.activeForeground": "#9aa2b4",
              "editorGutter.background": "#0a0c10",
              "editorCursor.foreground": "#6e7bff",
              "editorIndentGuide.background1": "#161a23",
              "editor.selectionBackground": "#6e7bff33",
              "editor.lineHighlightBackground": "#00000000",
              "editorWidget.background": "#11141b",
              "editorWidget.border": "#2b313d",
              "scrollbarSlider.background": "#262c38aa",
              "scrollbarSlider.hoverBackground": "#2b313dcc",
            },
          });
        }}
      />
    </div>
  );
}
