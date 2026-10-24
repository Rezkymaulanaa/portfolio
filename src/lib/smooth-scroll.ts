import type Lenis from "lenis";

// The running Lenis smooth scroll (SmoothScroll.tsx), shared with the scroll
// helpers in scroll.ts. null when smooth scrolling is off (reduced motion,
// before it starts, or on touch screens where Lenis leaves scrolling native).
let current: Lenis | null = null;

export function setSmoothScroll(lenis: Lenis | null) {
  current = lenis;
}

export function getSmoothScroll() {
  return current;
}
