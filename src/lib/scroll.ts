import { getSmoothScroll } from "./smooth-scroll";

// Smooth scrolling helpers (instant for people who prefer reduced motion).
// They go through Lenis when it runs (SmoothScroll.tsx), so its glide and
// the browser's own smooth scrolling never fight each other.

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

// Scrolls to the section with this id and puts "#id" in the address bar.
// Works every time, even when the address bar already shows the same "#id".
// Returns false when the section is not on this page.
export function scrollToSection(id: string): boolean {
  const section = document.getElementById(id);
  if (!section) return false;
  const lenis = getSmoothScroll();
  if (lenis) {
    // Lenis keeps the section's scroll-margin-top, like scrollIntoView.
    lenis.scrollTo(section);
  } else {
    section.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }
  window.history.replaceState(window.history.state, "", `#${id}`);
  return true;
}

// Scrolls back to the top and removes "#id" from the address bar.
export function scrollToTop() {
  const lenis = getSmoothScroll();
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: scrollBehavior() });
  window.history.replaceState(
    window.history.state,
    "",
    window.location.pathname + window.location.search,
  );
}
