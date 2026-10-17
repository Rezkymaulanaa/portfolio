import { Fragment, type CSSProperties, type ElementType } from "react";

// Heading whose words slide up one by one from behind a mask when it scrolls
// into view (styles: ".reveal-words" in globals.css).

type SplitTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Put every word on its own line (hero name). */
  lines?: boolean;
};

export function SplitText({ text, as: Tag = "span", className = "", id, lines = false }: SplitTextProps) {
  const words = text.split(" ").filter(Boolean);

  return (
    <Tag id={id} className={`reveal reveal-words ${className}`}>
      {words.map((word, index) => (
        <Fragment key={index}>
          <span
            className={`word ${lines ? "word-line" : ""}`}
            style={{ "--word-index": index } as CSSProperties}
          >
            <span>{word}</span>
          </span>
          {!lines && index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
