import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";

// Heading whose words slide up one by one from behind a mask when it scrolls
// into view (styles: ".reveal-words" in globals.css).

type SplitTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Put every word on its own line (hero name). */
  lines?: boolean;
  /** Shown right after the last word, never on a line of its own (e.g. an arrow). */
  suffix?: ReactNode;
};

export function SplitText({ text, as: Tag = "span", className = "", id, lines = false, suffix }: SplitTextProps) {
  const words = text.split(" ").filter(Boolean);

  return (
    <Tag id={id} className={`reveal reveal-words ${className}`}>
      {words.map((word, index) => {
        const wordElement = (
          <span
            className={`word ${lines ? "word-line" : ""}`}
            style={{ "--word-index": index } as CSSProperties}
          >
            <span>{word}</span>
          </span>
        );
        const isLast = index === words.length - 1;
        return (
          <Fragment key={index}>
            {isLast && suffix ? (
              <span className="whitespace-nowrap">
                {wordElement}
                {suffix}
              </span>
            ) : (
              wordElement
            )}
            {!lines && !isLast ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
