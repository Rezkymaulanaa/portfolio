"use client";

// A <script> that runs once, while the browser reads the first page load.
// When React renders it again later (in-app navigation, e.g. the language
// switch), it gets type "text/plain": the browser would not run it anyway,
// and React does not warn about a script in a component.
// From the Next.js guide "Preventing flash before hydration".

export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
