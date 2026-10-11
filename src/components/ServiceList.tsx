"use client";

import { useState } from "react";
import type { Service } from "@/sanity/lib/queries";
import { ArrowUpRightIcon } from "./icons";

// List of service rows. A row becomes "active" (pink background +
// description) on mouse hover or keyboard focus. Only one row is active.
// On touch devices the description is always shown under the title.

export function ServiceList({ services }: { services: Service[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <ul onPointerLeave={() => setActiveId(null)}>
      {services.map((service) => (
        <li key={service._id} className="reveal">
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
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 border-b px-4 py-5 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ink motion-reduce:transition-none desk:grid-cols-[minmax(max-content,0.8fr)_minmax(0,1fr)_auto] desk:px-5 desk:py-7 no-hover:active:rounded-card no-hover:active:bg-accent ${
        active ? "rounded-card border-transparent bg-accent" : "border-line"
      }`}
    >
      <h3 className="text-service font-semibold uppercase">{service.title}</h3>

      {/* Desktop with hover: description fades in. Space is always reserved. */}
      <p
        className={`col-span-2 row-start-2 mt-2 text-sm text-ink/80 desk:col-span-1 desk:row-start-auto desk:mt-0 desk:text-xl desk:leading-snug desk:text-ink ${
          active ? "desk:translate-y-0 desk:opacity-100" : "desk:translate-y-1 desk:opacity-0"
        } transition duration-300 motion-reduce:transition-none`}
      >
        {service.description}
      </p>

      <ArrowUpRightIcon className="col-start-2 row-start-1 size-6 desk:col-start-3 desk:size-9" />
    </div>
  );
}
