import { SplitText } from "./SplitText";

// Section heading pattern from the design:
// a huge faint watermark word behind (optional), and "/TITLE" in front.

type SectionHeadingProps = {
  watermark?: string;
  title: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  /** Use "h1" only on pages where this is the main heading. */
  as?: "h1" | "h2";
  id?: string;
};

export function SectionHeading({
  watermark,
  title,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  id,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={`relative overflow-x-clip ${isCenter ? "text-center" : ""}`}>
      {watermark && (
        <span
          aria-hidden="true"
          data-from={isCenter ? "scale" : "left"}
          className={`reveal pointer-events-none block select-none whitespace-nowrap text-watermark font-semibold uppercase tracking-[0.18em] ${
            tone === "dark" ? "text-ghost-dark" : "text-ghost"
          }`}
        >
          {watermark}
        </span>
      )}
      <SplitText
        as={Heading}
        id={id}
        text={`/${title}`}
        className={`relative block ${watermark ? "-mt-[calc(var(--text-watermark)*0.6)]" : ""} text-section font-semibold uppercase ${
          tone === "dark" ? "text-accent" : "text-ink"
        }`}
      />
    </div>
  );
}
