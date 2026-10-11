// Hidden link that appears on the first Tab press, so keyboard users can
// jump straight to the page content.

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-full bg-ink px-5 py-2 text-page focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60]"
    >
      Skip to content
    </a>
  );
}
