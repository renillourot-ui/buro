import { z } from "zod";

export const codeLanguageSchema = z.enum([
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
]);

export const tutorLanguageSchema = z.enum([
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "general",
]);

export const skillLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);

export const tutorModeSchema = z.enum(["learn", "debug", "challenge"]);

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

export const chatRequestSchema = z
  .object({
    /** The current in-memory conversation — last 20 turns, client-supplied. */
    messages: z.array(chatMessageSchema).min(1).max(20),
    language: tutorLanguageSchema,
    level: skillLevelSchema,
    mode: tutorModeSchema,
    beginner: z.boolean(),
  })
  .refine(
    (req) => req.messages[req.messages.length - 1]?.role === "user",
    { message: "The last message must come from the user." },
  );

export const reviewCodeRequestSchema = z.object({
  code: z.string().min(1).max(20000),
  language: codeLanguageSchema,
  level: skillLevelSchema,
  question: z.string().max(1000).optional(),
});

export const analyzeRequestSchema = z.object({
  code: z.string().min(1).max(20000),
  language: codeLanguageSchema,
  level: skillLevelSchema,
  errorMessage: z.string().max(4000).default(""),
  expected: z.string().max(2000).default(""),
  actual: z.string().max(2000).default(""),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
export type ReviewCodeRequestInput = z.infer<typeof reviewCodeRequestSchema>;
export type AnalyzeRequestInput = z.infer<typeof analyzeRequestSchema>;
