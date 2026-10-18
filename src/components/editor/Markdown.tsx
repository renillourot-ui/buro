"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils/cn";
import { CodeBlock } from "./CodeBlock";

/**
 * Markdown renderer for AI responses and reviews — GitHub-flavored tables,
 * fenced code blocks with copy buttons and consistent tutor typography.
 */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-tutor", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <>{children}</>,
          // node (hast reference) is intentionally not forwarded to the DOM
          code: ({ node: _node, className, children, ...rest }) => {
            void _node;
            const raw = String(children ?? "");
            const match = /language-([\w-]+)/.exec(className ?? "");
            if (match || raw.includes("\n")) {
              return <CodeBlock code={raw.replace(/\n$/, "")} language={match?.[1]} />;
            }
            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
