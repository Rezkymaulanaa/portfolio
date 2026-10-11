// Gray decorative brush line from design/garis-brush.svg.
// Inline SVG so it can use the ink color token at low opacity.

export function BrushStroke({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1360 1039"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none overflow-visible text-ink/12 ${className}`}
    >
      <path
        // Both ends are extended past the original artwork so the line always
        // runs off the edges of the section.
        d="M-394 1552L6.58261 1060.95C6.58261 1060.95 674.044 241.867 309.845 467.726C-54.355 693.586 1308.87 472.305 902.257 710.791C495.645 949.277 1390.78 5.83956 1390.78 5.83956L1927 -561"
        stroke="currentColor"
        strokeWidth="17"
      />
    </svg>
  );
}
