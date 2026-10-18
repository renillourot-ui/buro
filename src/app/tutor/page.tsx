import type { Metadata } from "next";
import { TutorApp } from "@/components/tutor/TutorApp";

export const metadata: Metadata = {
  title: "AI Programming Tutor",
  description:
    "Chat with a patient AI programming tutor. Learn concepts, debug errors and practice problems — Beginner Friendly, streaming responses, code workspace included.",
};

export const viewport = {
  // Allow the dvh-based app layout to size correctly on mobile.
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function TutorPage() {
  return (
    <main>
      <h1 className="sr-only">CodeMentor AI Tutor</h1>
      <TutorApp />
    </main>
  );
}
