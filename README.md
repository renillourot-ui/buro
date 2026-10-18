# CodeMentor AI

An AI programming tutor built with Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP and Monaco. Chat with a tutor that explains code rather than just generating it, analyze bugs, follow learning paths, solve challenges, and track progress — **all without persistence**: there is no database, no auth, no cookies, no localStorage. Everything lives in React state (or in-memory server state) and disappears on refresh, exactly as the spec requires.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

No environment variables are required — the default configuration talks to the same keyless providers as the bundled reference client `ai_client.py` (Vireonix `auto` → Murakumo `murakumo/free` → Murakumo `mishima`, in order).

Production:

```bash
npm run build
npm run start
```

Checks: `npm run lint` (ESLint) · `npx tsc --noEmit` (types) · `node scripts/e2e-chat.mjs` (browser E2E against a running server; requires Chrome at `/usr/bin/google-chrome` and `puppeteer-core`).

## Environment variables (all optional)

| Variable | Default | Purpose |
| --- | --- | --- |
| `AI_PROVIDER` | *(chain, see above)* | Force one provider: `vireonix`, `murakumo-free`, `murakumo-mishima`, or `custom` |
| `AI_BASE_URL` / `AI_API_KEY` / `AI_MODEL` | — | Only used when `AI_PROVIDER=custom` (or `AI_API_KEY` alone forces a keyed custom provider) |
| `AI_KEYLESS` | `1` | Set `0` to send `Authorization: Bearer <AI_API_KEY>` instead of key-free access |
| `AI_TIMEOUT_MS` | `120000` | Server-side watchdog per AI attempt |
| `CHAT_MAX_TOKENS` | `1600` | Max completion tokens for chat |
| `RATE_LIMIT_DISABLED` | unset | Set `1` to disable the in-memory rate limiter (dev only) |
| `NEXT_PUBLIC_MONACO_CDN` | official CDN | Public asset path for a self-hosted Monaco editor build |

**API keys are server-only.** Only `NEXT_PUBLIC_*` values reach the browser, and none are secrets.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page (GSAP hero, feature cards, learning-path previews) |
| `/tutor` | AI tutor chat — streaming, Retry, Stop, New Chat, follow-up chips |
| `/debugger` | Paste broken code + error → six-section diagnosis |
| `/learning-paths` · `/learn/[course]/[lesson]` | Static curricula, quizzes, hints, lesson completion |
| `/challenges` | 14 challenges; JS runs deterministic tests in your browser (Web Worker), other languages get labeled AI feedback |
| `/progress` | **Session-only** progress (a refresh resets it — clearly labeled on the page) |
| `/about` | Honest explanation of what the AI is and is not |

## API

| Endpoint | Behavior |
| --- | --- |
| `POST /api/tutor/chat` | SSE stream of `data: {type: delta \| done \| error}` frames; 200 is committed only after the first upstream chunk, else a JSON 502 |
| `POST /api/tutor/review-code` | Structured code review (markdown + served model) |
| `POST /api/debugger/analyze` | Six-section diagnosis (Problem / Why / Hint / Fix / Improved Code / What You Learned) |

All endpoints validate with Zod (size caps → 400/413, malformed → 400), rate-limit per IP-ish key (chat 12 / review+analyzy 10 per 5 min in-memory — resets on restart, per-instance only), map upstream failures honestly (502/503/504 — never fake content), and **never log message content**.

## Deliberate limitations

- **No persistence anywhere.** Refresh, tab-away, "New Chat" or a server restart wipes all state.
- The rate limiter and session progress are per-process memory; multi-instance deployments would need a shared store (out of scope by design here).
- There is no code execution on the server; challenge tests run in the browser.
- Provider free-tier capacity can be exhausted (surfaced as an honest 502).
"# buro" 
"# buro" 
