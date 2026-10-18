import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProgressClient } from "@/components/progress/ProgressClient";

export const metadata: Metadata = {
  title: "Session Progress",
  description: "Session-only activity overview. This app stores nothing — every indicator resets when you refresh.",
};

export default function ProgressPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Honest by design"
        title="Session Progress"
        description="What you've done so far in this browser session, derived from in-memory client state. There is no database, no profile, no streak and no history — refresh and it's a clean slate."
      />
      <ProgressClient />
    </main>
  );
}
