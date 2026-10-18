"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
      <p className="font-mono text-sm text-faint">runtime error</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Something crashed while rendering</h1>
      <p className="mt-2 text-[0.9375rem] leading-7 text-muted">
        Don&apos;t worry — no data was harmed, because no data is stored anywhere. Try again, or head back to the
        tutor.
      </p>
      <div className="mt-8 flex gap-2">
        <Button variant="secondary" onClick={reset}>
          Try again
        </Button>
        <LinkButton href="/tutor">Open the tutor</LinkButton>
      </div>
    </main>
  );
}
