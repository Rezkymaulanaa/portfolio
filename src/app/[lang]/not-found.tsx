"use client";

import { ArrowLeftIcon } from "@/components/icons";
import { LocalizedLink } from "@/components/LocalizedLink";
import { pillClasses } from "@/components/Pill";
import { SectionHeading } from "@/components/SectionHeading";
import { useDictionary } from "@/i18n/I18nProvider";

// 404 page, shown for any address that does not exist (inside the website
// layout, so navbar and footer are there). A not-found page gets no page
// parameters, so it reads the language from the layout.

export default function NotFound() {
  const t = useDictionary().notFound;

  return (
    <section className="mx-auto max-w-content px-gutter pt-36 text-center lg:pt-56">
      <SectionHeading as="h1" watermark="404" title={t.title} align="center" />
      <p className="reveal mx-auto mt-6 max-w-xl text-lead">{t.text}</p>
      <div className="reveal mt-10">
        <LocalizedLink href="/" className={pillClasses("accent", "text-pill")}>
          <ArrowLeftIcon /> {t.backHome}
        </LocalizedLink>
      </div>
    </section>
  );
}
