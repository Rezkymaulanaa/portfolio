"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localizePath } from "@/i18n/config";
import { useLocale } from "@/i18n/I18nProvider";

// next/link that stays in the current language: on Indonesian pages
// href="/work" goes to /id/work. Write hrefs as English addresses.

export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const locale = useLocale();
  return <Link href={localizePath(locale, href)} {...props} />;
}
