/**
 * Deterministic challenge checks for JavaScript.
 *
 * Runs the student's function in a short-lived Web Worker in their own
 * browser — the results are genuinely produced by execution (never invented),
 * and the code never touches the server. A watchdog terminates runaway or
 * looping submissions after ~2.5 s.
 */

import type { ChallengeTest } from "@/types/challenges";

export interface TestOutcome {
  label: string;
  pass: boolean;
  got?: string;
  error?: string;
}

export interface TestRunResult {
  outcomes: TestOutcome[];
  loadError?: string;
  timedOut?: boolean;
}

const WORKER_SOURCE = String.raw`
self.onmessage = function (event) {
  const data = event.data || {};
  const code = String(data.code || "");
  const cases = Array.isArray(data.cases) ? data.cases : [];

  function deepEqual(a, b) {
    try { return JSON.stringify(a) === JSON.stringify(b); } catch { return false; }
  }
  function format(v) {
    try { return JSON.stringify(v); } catch { return String(v); }
  }

  let fns = null;
  let loadError = null;
  try {
    const selectors = cases
      .map((c) => JSON.stringify(c.fn) + ': (typeof ' + c.fn + ' === "function" ? ' + c.fn + ' : null)')
      .join(",");
    const factory = new Function('"use strict";' + code + "\n;return {" + selectors + "};");
    fns = factory();
  } catch (err) {
    loadError = String((err && err.message) || err);
  }

  const outcomes = [];
  if (fns) {
    for (const c of cases) {
      const fn = fns[c.fn];
      if (!fn) {
        outcomes.push({ fn: c.fn, label: c.label, pass: false, error: "Function '" + c.fn + "' was not found — define it exactly." });
        continue;
      }
      try {
        const got = fn.apply(null, c.args);
        const pass = deepEqual(got, c.expected);
        outcomes.push({ fn: c.fn, label: c.label, pass: pass, got: pass ? undefined : format(got) });
      } catch (err) {
        outcomes.push({ fn: c.fn, label: c.label, pass: false, error: String((err && err.message) || err) });
      }
    }
  }
  self.postMessage({ loadError: loadError, outcomes: outcomes });
};
`;

export function formatCall(t: ChallengeTest): string {
  const args = t.args.map((arg) => (typeof arg === "string" ? JSON.stringify(arg) : String(arg))).join(", ");
  return `${t.fn}(${args})`;
}

export async function runChallengeTests(
  code: string,
  tests: ChallengeTest[],
  timeoutMs = 2500,
): Promise<TestRunResult> {
  const cases = tests.map((t) => ({ fn: t.fn, args: t.args, expected: t.expected, label: formatCall(t) }));

  if (typeof window === "undefined" || typeof Worker === "undefined") {
    return { outcomes: [], loadError: "This browser cannot run the local test worker." };
  }

  const blob = new Blob([WORKER_SOURCE], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url);

  return new Promise<TestRunResult>((resolve) => {
    const timeout = window.setTimeout(() => {
      worker.terminate();
      resolve({ outcomes: [], timedOut: true });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent) => {
      window.clearTimeout(timeout);
      worker.terminate();
      const data = event.data as { loadError?: string; outcomes?: TestOutcome[] };
      resolve({ loadError: data.loadError, outcomes: data.outcomes ?? [] });
    };
    worker.onerror = (event) => {
      window.clearTimeout(timeout);
      worker.terminate();
      resolve({ loadError: event.message || "The test worker crashed.", outcomes: [] });
    };

    worker.postMessage({ code, cases });
  });
}
