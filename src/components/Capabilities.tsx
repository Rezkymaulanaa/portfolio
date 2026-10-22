import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { SkillGroup, Tool } from "@/sanity/lib/queries";
import { SectionHeading } from "./SectionHeading";

// Dark "Capabilities" section: skill groups with bullet lists and a grid
// of tool icons.

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

          {tools.length > 0 && (
            <div className="border-b border-line/80 py-6 lg:px-5 lg:py-8">
              <h3 className="reveal text-h3 font-semibold">
                {t.tools}
              </h3>
              {/* Hover (or keyboard focus): the tile lifts, its border turns
                  pink, the icon tilts with a small bounce, a name label
                  appears above it and the other tools dim (globals.css). */}
              <ul className="tool-list mt-8 flex flex-wrap gap-3 sm:gap-5 lg:mt-10 lg:gap-9">
                {tools.map((tool) => (
                  <li
                    key={tool._id}
                    data-from="scale"
                    className="reveal size-14 sm:size-16 lg:size-[5.125rem]"
                  >
                    <div
                      tabIndex={0}
                      className="tool-tile group/tool relative flex size-full items-center justify-center rounded-md border border-page/40 bg-ink p-2 outline-none transition-[translate,border-color,background-color,box-shadow,opacity,filter] duration-500 ease-(--ease-reveal) hover:-translate-y-1.5 hover:border-accent hover:bg-page/5 hover:shadow-[0_12px_30px_-12px_rgb(247_188_255/0.5)] focus-visible:-translate-y-1.5 focus-visible:border-accent focus-visible:bg-page/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:p-3"
                    >
                      <Image
                        src={urlFor(tool.icon)}
                        alt={tool.name}
                        width={58}
                        height={58}
                        className="size-full object-contain transition-[scale,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/tool:scale-110 group-hover/tool:-rotate-6 group-focus-visible/tool:scale-110 group-focus-visible/tool:-rotate-6 motion-reduce:transition-none"
                      />
                      {/* Name label; the image alt already names the tool for screen readers. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-[calc(100%+0.625rem)] left-1/2 z-10 -translate-x-1/2 translate-y-1 rounded-full bg-accent px-2.5 py-1 text-label font-medium whitespace-nowrap text-ink opacity-0 shadow-pill transition-[opacity,translate] duration-300 ease-(--ease-reveal) after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-accent group-hover/tool:translate-y-0 group-hover/tool:opacity-100 group-focus-visible/tool:translate-y-0 group-focus-visible/tool:opacity-100 motion-reduce:transition-none"
                      >
                        {tool.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
