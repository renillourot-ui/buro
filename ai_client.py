#!/usr/bin/env python3
"""ai_client.py — free, keyless AI chat through Vireonix + Murakumo.

Two OpenAI-compatible endpoints, neither requires an API key or account:

  Vireonix   https://vireonix.ai/v1/chat/completions      model "auto"
             Free per-IP: ~2,000,000 input / 100,000 output tokens per hour.
             Quota:  GET https://vireonix.ai/api/limits
                     Headers X-RateLimit-Remaining{-Input,-Output}.

  Murakumo   https://api.murakumo.cloud/v1/chat/completions   (public route)
             "murakumo/free"  -> OpenRouter free lane, automatic fallback
                                 to mishima. Public route caps max_tokens
                                 at 2048. 429/402 = daily-cap/balance.
             "mishima"        -> fleet model, 131k context.
             The model that actually answered is announced by the
             x-murakumo-served-model header; read it instead of trusting
             the request alone. Docs: https://murakumo.cloud/docs

  Router:    ask() tries Vireonix first, then murakumo/free, then mishima
             and returns the first success (chain = ["vireonix", ...]).

Usage examples:
    python3 ai_client.py ask "Explain deterministic hill climbing in one paragraph"
    python3 ai_client.py ask "..." --provider murakumo/free --max-tokens 300
    python3 ai_client.py streaming "Write a haiku about clouds"
    python3 ai_client.py status        # limits + readiness for both providers

Library use:
    from ai_client import ask, stream, vireonix, murakumo

    reply = ask("Hello!")                        # full chain, first success
    reply = ask("Hello!", provider="mishima")     # a specific Murakumo model
    for chunk in stream("Hello!", provider="vireonix"):
        print(chunk, end="", flush=True)
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request

# --------------------------------------------------------------------------
# Configuration
# --------------------------------------------------------------------------

VIREONIX_BASE = "https://vireonix.ai/v1"
MURAKUMO_BASE = "https://api.murakumo.cloud"
VIREONIX_MODEL = "auto"                       # only public model on Vireonix
MURAKUMO_FREE = "murakumo/free"               # OpenRouter lane -> mishima
MURAKUMO_FALLBACK = "mishima"                 # direct Murakumo fleet model
MURAKUMO_MAX_TOKENS_CAP = 2048                # hard cap on the public route
REQUEST_TIMEOUT = 120                         # seconds, ordinary requests
USER_AGENT = "Mozilla/5.0"                    # default urllib UA gets 403'd

CHAIN = ["vireonix", MURAKUMO_FREE, MURAKUMO_FALLBACK]   # default fallback order


class APIError(RuntimeError):
    """Raised when a request fails; carries HTTP status and provider/model."""


def _post_json(url: str, payload: dict, timeout: float, headers: dict | None = None):
    """POST JSON, return (raw bytes body, response headers). No auth."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json", "User-Agent": USER_AGENT,
                 **(headers or {})},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read(), dict(resp.headers)
    except urllib.error.HTTPError as e:                       # 4xx/5xx etc.
        detail = e.read().decode("utf-8", "replace")[:400]
        raise APIError(f"HTTP {e.code} from {url}: {detail}") from None
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        raise APIError(f"{type(e).__name__} reaching {url}: {e}") from None


def _stream_sse(url: str, payload: dict, timeout: float):
    """Yield plain text delta chunks from an OpenAI-style SSE response.

    Raises APIError if the server reports an error mid-stream or if the
    stream ends without a single content chunk (treated as a failure so
    callers can fall back to the next provider)."""
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, method="POST",
        headers={"Content-Type": "application/json",
                 "Accept": "text/event-stream", "User-Agent": USER_AGENT},
    )
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:300]
        raise APIError(f"HTTP {e.code} from {url}: {detail}") from None
    n_yielded = 0
    try:
        for raw in resp:
            line = raw.decode("utf-8", "replace").strip()
            if not line.startswith("data:") or line == "data: [DONE]":
                continue
            try:
                chunk = json.loads(line[len("data:"):].strip())
            except ValueError:
                continue
            if chunk.get("error"):
                raise APIError(f"stream error: {chunk['error']}")
            delta = chunk.get("choices", [{}])[0].get("delta", {})
            piece = delta.get("content") or ""
            if piece:
                n_yielded += 1
                yield piece
    finally:
        resp.close()
    if n_yielded == 0:
        raise APIError(f"stream ended without content ({url})")


def _get_json(url: str, timeout: float = 15):
    """GET a JSON document without authentication."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def _extract_text(choice: dict) -> str:
    """Get assistant text; some routed models put the draft in 'reasoning'."""
    msg = choice.get("message", {})
    text = msg.get("content")
    if not text and isinstance(msg.get("reasoning"), str):
        text = msg["reasoning"]                 # rough-cut fallback (e.g. cut off)
    return text or ""


# --------------------------------------------------------------------------
# Vireonix — vireonix.ai  (model "auto", no key, per-IP hourly quotas)
# --------------------------------------------------------------------------

class Vireonix:
    name = "Vireonix"

    def chat(self, messages, *, model=VIREONIX_MODEL, max_tokens=None,
             temperature=None, stream=False, timeout=REQUEST_TIMEOUT):
        payload = {"model": model, "messages": messages}
        if max_tokens is not None:
            payload["max_tokens"] = max_tokens
        if temperature is not None:
            payload["temperature"] = temperature
        if stream:
            payload["stream"] = True
        url = f"{VIREONIX_BASE}/chat/completions"
        if stream:
            return _stream_sse(url, payload, timeout)
        body, headers = _post_json(url, payload, timeout)
        out = json.loads(body.decode("utf-8", "replace"))
        choice = (out.get("choices") or [{}])[0]
        remaining = headers.get("X-RateLimit-Remaining", "")
        return _extract_text(choice), out.get("model", model), remaining

    def limits(self, timeout=15):
        """GET /api/limits -> remaining-percent dict for your IP."""
        return _get_json("https://vireonix.ai/api/limits", timeout)
    def status(self, timeout=15):
        base = self.limits(timeout)
        return {"provider": self.name, "model": VIREONIX_MODEL,
                "limits": base}


# --------------------------------------------------------------------------
# Murakumo — api.murakumo.cloud  (public chat route, no key)
# --------------------------------------------------------------------------

class Murakumo:
    name = "Murakumo"

    def chat(self, messages, *, model=MURAKUMO_FREE, max_tokens=None,
             temperature=None, stream=False, timeout=300):
        if max_tokens is not None and max_tokens > MURAKUMO_MAX_TOKENS_CAP:
            max_tokens = MURAKUMO_MAX_TOKENS_CAP   # public route hard cap
        payload = {"model": model, "messages": messages, "max_tokens": max_tokens or 512}
        if temperature is not None:
            payload["temperature"] = temperature
        if stream:
            payload["stream"] = True
        url = f"{MURAKUMO_BASE}/v1/chat/completions"
        if stream:
            return _stream_sse(url, payload, timeout)
        # Cold starts on fleet models can be slow; give generous time back-off.
        for attempt in range(2):
            try:
                body, headers = _post_json(url, payload, timeout)
                out = json.loads(body.decode("utf-8", "replace"))
                served = headers.get("x-murakumo-served-model", out.get("model", ""))
                choice = (out.get("choices") or [{}])[0]
                return _extract_text(choice), served, f"served={served}"
            except APIError as e:
                # 402/429 free-lane quota, 5xx: one bounded retry, then raise
                if attempt == 1:
                    raise
                time.sleep(1.5 * (attempt + 1))
        raise APIError("unreachable")

    def ready(self, timeout=15):
        return _get_json(f"{MURAKUMO_BASE}/ready", timeout)

    def models(self, timeout=15):
        return _get_json(f"{MURAKUMO_BASE}/v1/models", timeout)

    def status(self, timeout=15):
        try:
            ready = self.ready(timeout)
            models = self.models(timeout)
            names = [m["id"] for m in models.get("data", [])]
            return {"provider": self.name, "ready": ready.get("ok", False),
                    "models": names, "raw": ready}
        except Exception as e:
            return {"provider": self.name, "error": str(e)}


vireonix = Vireonix()
murakumo = Murakumo()


# --------------------------------------------------------------------------
# Unified router — Vireonix -> murakumo/free -> mishima
# --------------------------------------------------------------------------

def _provider_for(selector: str):
    if selector == "vireonix":
        return vireonix, VIREONIX_MODEL
    return murakumo, selector          # murakumo/free / mishima / any murakumo id


def ask(prompt: str, *, provider: str | None = None, system: str | None = None,
        history: list | None = None, max_tokens: int = 512,
        temperature: float | None = None, chain: list[str] | None = None):
    """Send one chat request. provider=None walks the fallback chain (default).

    Returns dict: {text, provider, model, info}.
    """
    order = [provider] if provider else (chain or CHAIN)
    messages = ([{"role": "system", "content": system}] if system else []) \
        + (history or []) + [{"role": "user", "content": prompt}]
    errors = []
    for selector in order:
        api, model = _provider_for(selector)
        try:
            text, served, info = api.chat(
                messages, model=model, max_tokens=max_tokens,
                temperature=temperature,
            )
            if text.strip():
                return {"text": text, "provider": api.name,
                        "model": served or model, "info": info}
            errors.append(f"{api.name}/{model}: empty response")
        except APIError as e:
            errors.append(f"{api.name}/{model}: {e}")
        except Exception as e:
            errors.append(f"{api.name}/{model}: {type(e).__name__}: {e}")
    raise APIError("all providers failed:\n  " + "\n  ".join(errors))


def stream(prompt: str, *, provider: str | None = None, system: str | None = None,
           max_tokens: int = 512, temperature: float | None = None,
           chain: list[str] | None = None):
    """Stream tokens, walking the fallback chain whenever a provider fails
    or streams nothing. An explicit provider is used exclusively."""
    order = [provider] if provider else (chain or CHAIN)
    messages = ([{"role": "system", "content": system}] if system else []) \
        + [{"role": "user", "content": prompt}]
    errors = []
    for selector in order:
        api, model = _provider_for(selector)
        try:
            for piece in api.chat(messages, model=model, max_tokens=max_tokens,
                                  temperature=temperature, stream=True):
                yield piece
            return
        except (APIError, OSError) as e:
            errors.append(f"{api.name}/{model}: {e}")
    raise APIError("all providers failed while streaming:\n  "
                   + "\n  ".join(errors))


def status() -> list:
    """Probe both endpoints (Vireonix limits, Murakumo /ready + /v1/models)."""
    out = []
    for api in (vireonix, murakumo):
        try:
            out.append(api.status())
        except Exception as e:
            out.append({"provider": api.name, "error": f"{type(e).__name__}: {e}"})
    return out


# --------------------------------------------------------------------------
# CLI
# --------------------------------------------------------------------------

def main(argv=None):
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("ask", help="one-shot request (fallback chain by default)")
    a.add_argument("prompt")
    a.add_argument("--provider", default=None,
                   help=f"vireonix | {MURAKUMO_FREE} | {MURAKUMO_FALLBACK}")
    a.add_argument("--system", default=None)
    a.add_argument("--max-tokens", type=int, default=512)
    a.add_argument("--temperature", type=float, default=None)

    s = sub.add_parser("streaming", help="stream tokens to stdout")
    s.add_argument("prompt")
    s.add_argument("--provider", default="vireonix", choices=["vireonix", MURAKUMO_FREE])
    s.add_argument("--max-tokens", type=int, default=512)

    sub.add_parser("status", help="probe both endpoints")

    args = p.parse_args(argv)

    if args.cmd == "status":
        st = status()
        for entry in st:
            json.dump(entry, sys.stdout, indent=2)
            sys.stdout.write("\n\n")
        return

    if args.cmd == "streaming":
        try:
            for chunk in stream(args.prompt, provider=args.provider,
                                max_tokens=args.max_tokens):
                print(chunk, end="", flush=True)
        except KeyboardInterrupt:
            pass
        except (APIError, OSError) as e:
            print(f"\nerror: {e}", file=sys.stderr)
            sys.exit(1)
        print()                                   # final newline
        return

    # ask
    t0 = time.time()
    try:
        r = ask(args.prompt,
                provider=getattr(args, "provider", None),
                system=args.system, max_tokens=args.max_tokens,
                temperature=args.temperature)
    except (APIError, OSError) as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(1)
    header = f"[{r['provider']} | {r['model']} | {time.time() - t0:.1f}s]"
    print(header, file=sys.stderr)            # provenance to stderr
    print(r["text"])                          # response to stdout


if __name__ == "__main__":
    main()
