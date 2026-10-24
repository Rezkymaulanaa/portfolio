"use client";

import { useState } from "react";
import type { Service } from "@/sanity/lib/queries";
import { ArrowUpRightIcon } from "./icons";

// List of service rows. A row becomes "active" (pink background +
// description) on mouse hover or keyboard focus. Only one row is active.
// The description sits under the title: on touch devices always shown, on
// desktop folded away until the row is active.

export function ServiceList({ services }: { services: Service[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <ul onPointerLeave={() => setActiveId(null)}>
      {services.map((service) => (
        <li key={service._id} data-from="left" className="reveal">
          <ServiceRow
            service={service}
            active={activeId === service._id}
            onActivate={() => setActiveId(service._id)}
            onDeactivate={() =>
              setActiveId((current) => (current === service._id ? null : current))
            }
          />
        </li>
      ))}
    </ul>
  );
}

type ServiceRowProps = {
  service: Service;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

export function ServiceRow({ service, active, onActivate, onDeactivate }: ServiceRowProps) {
  return (
    <div
      // Focusable so keyboard users can reach each row with Tab.
      tabIndex={0}
      onPointerEnter={(event) => event.pointerType === "mouse" && onActivate()}
      // Only keyboard focus activates the row (a tap on a phone should not).
      onFocus={(event) => event.currentTarget.matches(":focus-visible") && onActivate()}
      onBlur={onDeactivate}
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b px-4 py-5 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ink motion-reduce:transition-none desk:px-5 desk:py-7 no-hover:active:rounded-card no-hover:active:bg-accent ${
        active ? "rounded-card border-transparent bg-accent" : "border-line"
      }`}
    >
      <h3 className="text-service font-semibold uppercase">{service.title}</h3>

      <ArrowUpRightIcon
        className={`size-6 transition-transform duration-500 ease-(--ease-reveal) motion-reduce:transition-none desk:size-9 ${
          active ? "desk:rotate-45" : ""
        }`}
      />

      {/* Description under the title. Desktop with hover: folded away, so
          every row has the same height, and it unfolds when the row is
          active (grid row from 0fr to 1fr animates to the text's height). */}
      <div
        className={`col-span-2 grid transition-[grid-template-rows] duration-500 ease-(--ease-reveal) motion-reduce:transition-none ${
          active ? "desk:grid-rows-[1fr]" : "desk:grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <p
            className={`mt-2 max-w-[42rem] text-sm text-ink/80 transition duration-500 motion-reduce:transition-none desk:mt-4 desk:text-lead desk:text-ink ${
              active ? "desk:translate-y-0 desk:opacity-100" : "desk:-translate-y-2 desk:opacity-0"
            }`}
          >
            {service.description}
          </p>
        </div>
      </div>
    </div>
  );
}
