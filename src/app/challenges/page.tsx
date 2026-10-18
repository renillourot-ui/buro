import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChallengesClient } from "@/components/challenges/ChallengesClient";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Coding Challenges",
  description: "Practice coding challenges with deterministic local tests and AI feedback. No accounts, nothing stored.",
};

export default function ChallengesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Practice deliberately"
        title="Coding Challenges"
        description="Solve problems in the in-browser editor. JavaScript challenges are checked against real test cases that run locally in your browser; other languages receive honest AI feedback."
        actions={<LinkButton href="/tutor" variant="secondary">Ask the tutor instead</LinkButton>}
      />
      <ChallengesClient />
    </main>
  );
}
