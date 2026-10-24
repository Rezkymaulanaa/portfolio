import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { SkillGroup, Tool } from "@/sanity/lib/queries";
import { SectionHeading } from "./SectionHeading";
import { ToolsScroller } from "./ToolsScroller";

// Dark "Capabilities" section: skill groups with bullet lists, then the
// tool icons as a horizontal scroll (ToolsScroller.tsx).

type CapabilitiesProps = {
  skillGroups: SkillGroup[];
  tools: Tool[];
  lang: Locale;
};

export function Capabilities({ skillGroups, tools, lang }: CapabilitiesProps) {
  const t = getDictionary(lang).capabilities;
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="scroll-mt-8 bg-ink py-20 text-page lg:pt-44 lg:pb-40"
    >
      <div className="mx-auto max-w-content px-gutter">
        <SectionHeading
          id="capabilities-heading"
          watermark={t.watermark}
          title={t.title}
          tone="dark"
        />

        <div className="mt-10 lg:mt-20">
          {skillGroups.map((group) => (
            <div key={group._id} className="reveal border-b border-line/80 py-6 lg:px-5 lg:py-8">
              <h3 className="text-h3 font-semibold">{group.title}</h3>
              <ul className="mt-4 list-disc space-y-1 pl-6 text-body text-page/85 marker:text-page/85 lg:mt-5 lg:pl-8">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {tools.length > 0 && <ToolsScroller tools={tools} title={t.tools} heading={t.toolsHeading} />}
    </section>
  );
}
