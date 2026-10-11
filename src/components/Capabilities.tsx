import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { SkillGroup, Tool } from "@/sanity/lib/queries";
import { SectionHeading } from "./SectionHeading";

// Dark "Capabilities" section: skill groups with bullet lists and a grid
// of tool icons.

type CapabilitiesProps = {
  skillGroups: SkillGroup[];
  tools: Tool[];
};

export function Capabilities({ skillGroups, tools }: CapabilitiesProps) {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="scroll-mt-8 bg-ink py-20 text-page lg:pt-44 lg:pb-40"
    >
      <div className="mx-auto max-w-content px-gutter">
        <SectionHeading
          id="capabilities-heading"
          watermark="Capabilities"
          title="Main Skills & Tools"
          tone="dark"
        />

        <div className="mt-10 lg:mt-20">
          {skillGroups.map((group) => (
            <div key={group._id} className="reveal border-b border-line/80 py-6 lg:px-5 lg:py-8">
              <h3 className="text-xl font-semibold lg:text-[2rem] lg:leading-tight">{group.title}</h3>
              <ul className="mt-4 list-disc space-y-1 pl-6 text-base text-page/85 marker:text-page/85 lg:mt-6 lg:pl-9 lg:text-2xl lg:leading-tight">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          {tools.length > 0 && (
            <div className="reveal border-b border-line/80 py-6 lg:px-5 lg:py-8">
              <h3 className="text-xl font-semibold lg:text-[2rem] lg:leading-tight">
                Tools that i usually use
              </h3>
              <ul className="mt-6 flex flex-wrap gap-3 sm:gap-5 lg:gap-9">
                {tools.map((tool) => (
                  <li
                    key={tool._id}
                    className="flex size-14 items-center justify-center rounded-md border border-page/40 bg-ink p-2 sm:size-16 lg:size-[5.125rem] lg:p-3"
                  >
                    <Image
                      src={urlFor(tool.icon)}
                      alt={tool.name}
                      title={tool.name}
                      width={58}
                      height={58}
                      className="size-full object-contain"
                    />
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
