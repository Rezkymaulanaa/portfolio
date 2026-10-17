import type { CaseBlock } from "@/sanity/lib/queries";
import { CaseNav, type CaseNavItem } from "./CaseNav";
import { DetailImage } from "../DetailImage";
import { SplitText } from "../SplitText";

// Case study on the project detail page: a list of content blocks from the
// Studio. Long case studies (3+ sections with a heading) get a side menu.

export function CaseStudy({ blocks }: { blocks: CaseBlock[] }) {
  const navItems: CaseNavItem[] = blocks
    .filter((block) => block.heading)
    .map((block) => ({ id: sectionId(block), label: block.heading! }));
  const hasNav = navItems.length >= 3;

  return (
    <div className={`mt-16 lg:mt-28 ${hasNav ? "lg:grid lg:grid-cols-[13rem_1fr] lg:gap-16" : ""}`}>
      {hasNav && (
        <div className="hidden lg:block">
          <CaseNav items={navItems} />
        </div>
      )}
      <div className={`space-y-20 lg:space-y-28 ${hasNav ? "" : "mx-auto max-w-[56rem]"}`}>
        {blocks.map((block) => (
          <section
            key={block._key}
            id={sectionId(block)}
            aria-labelledby={block.heading ? `${sectionId(block)}-heading` : undefined}
            className="scroll-mt-10"
          >
            {block.heading && (
              <BlockHeading
                id={`${sectionId(block)}-heading`}
                number={navItems.findIndex((item) => item.id === sectionId(block)) + 1}
                showNumber={hasNav}
              >
                {block.heading}
              </BlockHeading>
            )}
            {block.intro && <Paragraphs text={block.intro} className="mt-4 text-muted" />}
            <div className={block.heading || block.intro ? "mt-8 lg:mt-10" : ""}>
              <BlockBody block={block} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function sectionId(block: CaseBlock) {
  return `section-${block._key}`;
}

function BlockBody({ block }: { block: CaseBlock }) {
  switch (block._type) {
    case "caseText":
      return (
        <div className="reveal space-y-6">
          {block.body && <Paragraphs text={block.body} />}
          {block.points && block.points.length > 0 && <Bullets items={block.points} />}
        </div>
      );

    case "caseStats":
      return (
        <ul className="reveal grid gap-8 rounded-frame bg-ink p-6 text-page sm:grid-cols-2 sm:p-10 lg:auto-cols-fr lg:grid-flow-col lg:px-12 lg:py-12">
          {block.items?.map((item) => (
            <li key={item._key} data-from="scale" className="reveal">
              <p className="text-5xl font-semibold leading-none text-accent lg:text-6xl">{item.value}</p>
              <p className="mt-3 text-small text-page/75">{item.label}</p>
            </li>
          ))}
        </ul>
      );

    case "caseProblems":
      return (
        <ul className="space-y-4">
          {block.items?.map((item) => (
            <li key={item._key} className="grid gap-3 lg:grid-cols-2">
              <div data-from="left" className="reveal rounded-frame border border-line bg-surface p-6 lg:p-8">
                <p className="text-label font-semibold uppercase tracking-[0.2em] text-muted">Problem</p>
                <Paragraphs text={item.problem} className="mt-3" />
              </div>
              <div data-from="right" className="reveal rounded-frame bg-ink p-6 text-page lg:p-8">
                <p className="text-label font-semibold uppercase tracking-[0.2em] text-accent">Solution</p>
                <Paragraphs text={item.solution} className="mt-3 text-page/90" />
              </div>
            </li>
          ))}
        </ul>
      );

    case "caseSteps":
      return (
        <ol className="border-t border-line">
          {block.steps?.map((step, index) => (
            <li
              key={step._key}
              data-from="left"
              className="reveal grid grid-cols-[auto_1fr] gap-5 border-b border-line py-6 lg:gap-8 lg:py-8"
            >
              <span className="flex size-10 items-center justify-center rounded-full border border-ink text-small font-semibold tabular-nums lg:size-12">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-h3 font-semibold">{step.title}</h3>
                {step.description && <Paragraphs text={step.description} className="mt-2 text-muted" />}
              </div>
            </li>
          ))}
        </ol>
      );

    case "caseImages":
      return (
        <div className="space-y-6">
          {block.images?.map((image) => (
            <DetailImage
              key={image._key}
              image={image}
              mockup={image.mockup}
              extraImages={image.mockupImages}
              caption={image.caption}
              displayWidth={900}
            />
          ))}
        </div>
      );

    case "caseTable":
      return (
        <div className="reveal overflow-x-auto rounded-frame border border-line bg-surface">
          <table className="w-full min-w-[36rem] text-left text-body">
            {block.columns && block.columns.length > 0 && (
              <thead className="bg-ink text-page">
                <tr>
                  {block.columns.map((column) => (
                    <th key={column} scope="col" className="px-5 py-4 font-semibold">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows?.map((row) => (
                <tr key={row._key} className="border-t border-line first:border-t-0">
                  {row.cells?.map((cell, index) => (
                    <td key={index} className="px-5 py-4 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function BlockHeading({
  id,
  number,
  showNumber,
  children,
}: {
  id: string;
  number: number;
  showNumber: boolean;
  children: string;
}) {
  return (
    <div>
      {showNumber && (
        <p data-from="left" className="reveal text-label font-semibold tabular-nums tracking-[0.2em] text-muted">
          {String(number).padStart(2, "0")}
        </p>
      )}
      <SplitText
        as="h2"
        id={id}
        text={children}
        className="mt-2 block text-h2 font-semibold"
      />
    </div>
  );
}

// Text with paragraphs separated by an empty line.
function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  return (
    <div className={`max-w-[44rem] space-y-4 text-body ${className}`}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="max-w-[44rem] list-disc space-y-2 pl-6 text-body marker:text-ink">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
