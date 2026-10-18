import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { DebuggerClient } from "@/components/debugger/DebuggerClient";

export const metadata: Metadata = {
  title: "Debugging Assistant",
  description: "Paste broken code and an error message — get a diagnosis, why it happens, a fix and prevention tips.",
};

export default function DebuggerPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Debug with a mentor, not a search engine"
        title="Smart Debugging Assistant"
        description="Add your code, the error message, and what should happen instead. The assistant reasons through the most likely cause and teaches the fix — it never invents stacks traces or fake test output."
      />
      <DebuggerClient />
    </main>
  );
}
