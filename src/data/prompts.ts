import type { TutorLanguage } from "@/types";

/** Contextual suggested topics per tutor language. */
export const SUGGESTED_TOPICS: Record<TutorLanguage, string[]> = {
  javascript: [
    "What is a closure and when would I actually use one?",
    "Explain let, const and var with examples.",
    "How do promises and async/await work together?",
    "Teach me array methods: map, filter and reduce.",
    "What is the event loop, step by step?",
  ],
  typescript: [
    "When should I use an interface vs a type alias?",
    "Explain union types and type narrowing.",
    "How do generics work? Give a practical example.",
    "Why is any dangerous, and what should I use instead?",
    "Show me how to type a common callback pattern.",
  ],
  python: [
    "How do lists and dictionaries differ, and when is each the right choice?",
    "Explain list comprehensions with examples.",
    "How does try/except finally work?",
    "What are f-strings and how should I format output?",
    "Show me how to structure a small Python module.",
  ],
  html: [
    "Explain semantic HTML and why it matters.",
    "How should I use heading levels correctly?",
    "What attributes make a form accessible?",
    "Explain the difference between block and inline elements.",
    "How do I include images responsibly (alt text, lazy loading)?",
  ],
  css: [
    "Explain the box model with a diagram-style walkthrough.",
    "When should I use flexbox vs grid?",
    "How do media queries make a layout responsive?",
    "Explain specificity and why my styles get overridden.",
    "What is the cascade, in plain words?",
  ],
  general: [
    "How do I choose my first programming language?",
    "What does a typical debugging process look like?",
    "Explain Big-O notation with everyday examples.",
    "How do I read error messages without panicking?",
    "What is version control and why does everyone use git?",
  ],
};

/** Mode-tinted learning prompts shown under the topics. */
export function learningPrompts(language: TutorLanguage): string[] {
  const label = language === "general" ? "JavaScript" : language;
  return [
    `Quiz me on ${label} basics, one question at a time.`,
    `Give me a small ${label} practice problem, then review my attempt.`,
    `Show a common beginner mistake in ${label} and how to fix it.`,
    "Explain recursion with a step-by-step trace.",
  ];
}
