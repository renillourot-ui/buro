"use client";

import { useSyncExternalStore } from "react";

let query: MediaQueryList | null = null;

function getQuery(): MediaQueryList {
  if (!query) {
    query = window.matchMedia("(prefers-reduced-motion: reduce)");
  }
  return query;
}

function subscribe(onChange: () => void): () => void {
  const media = getQuery();
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/** Live `prefers-reduced-motion` state for animation decisions (GSAP included). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => getQuery().matches, () => false);
}
