import puppeteer from "puppeteer-core";

const BASE = process.env.BASE || "http://localhost:3000";
const ok = (m) => console.log("PASS  " + m);
const fail = (m) => { console.log("FAIL  " + m); process.exitCode = 1; };

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(120000);
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Tutor page loads with input
  await page.goto(BASE + "/tutor", { waitUntil: "networkidle2", timeout: 90000 });
  await page.waitForSelector("#chat-input", { timeout: 30000 });
  ok("/tutor renders with chat input");

  // 2. Send a message and get a streamed reply (real AI)
  await page.type("#chat-input", "What is a JavaScript closure? Two sentences max.", { delay: 10 });
  await page.keyboard.press("Enter");
  // the Stop button appears while generating
  await page.waitForFunction(
    () => [...document.querySelectorAll("button")].some((b) => (b.getAttribute("aria-label") || "").includes("Stop generating")),
    { timeout: 60000 },
  );
  ok("generation started (Stop button visible → real streaming request)");
  // wait for generation to finish: Stop button gone AND at least one assistant reply
  await page.waitForFunction(
    () => {
      const stopGone = ![...document.querySelectorAll("button")].some((b) => (b.getAttribute("aria-label") || "").includes("Stop generating"));
      const log = document.querySelector('[aria-label="Conversation"]');
      return stopGone && log && log.children.length >= 2;
    },
    { timeout: 150000 },
  );
  const transcript = await page.evaluate(() => document.querySelector('[aria-label="Conversation"]')?.textContent || "");
  ok(`assistant reply rendered (${transcript.length} chars of transcript)`);
  if (!/closur/i.test(transcript)) fail("streamed reply does not mention closure — content check");
  else ok("streamed reply mentions closures (real AI content)");

  // 3. New Chat → instantly empty (click via live in-page query, not stale handles)
  const clicked = await page.evaluate(() => {
    const target = [...document.querySelectorAll("button")].find(
      (b) => b.textContent.trim() === "New Chat" && !b.disabled,
    );
    if (!target) return false;
    target.click();
    return true;
  });
  if (!clicked) fail("New Chat button not found");
  await page.waitForFunction(
    () => {
      const ta = document.querySelector("#chat-input");
      // success = log removed from DOM, empty-state rendered, input cleared
      return document.querySelectorAll('[role="log"]').length === 0 && ta && ta.value === "";
    },
    { timeout: 10000 },
  );
  ok("New Chat clears the conversation and input immediately");
  const emptyState = await page.evaluate(() => document.body.textContent.includes("What are we learning today?"));
  emptyState ? ok("empty-state copy visible after New Chat") : fail("empty-state copy not visible");

  // 4. Reload → still empty (state-only, nothing persisted)
  await page.reload({ waitUntil: "networkidle2", timeout: 90000 });
  await page.waitForSelector("#chat-input", { timeout: 30000 });
  const afterReload = await page.evaluate(() => {
    const log = document.querySelector('[role="log"]');
    const empty = document.body.textContent.includes("What are we learning today?");
    return { logLen: log ? log.textContent.trim().length : 0, empty };
  });
  (afterReload.logLen === 0 && afterReload.empty) ? ok("after reload the conversation is still empty (no persistence)") : fail(`after reload: logLen=${afterReload.logLen} emptyState=${afterReload.empty}`);
} finally {
  await browser.close();
}
