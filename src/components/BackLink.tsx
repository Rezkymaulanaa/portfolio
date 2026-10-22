"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { localizePath, splitLocale } from "@/i18n/config";
import { useLocale } from "@/i18n/I18nProvider";

// "Back" button that returns to the previous page on this site (with its
// scroll position). If there is no previous page on this site — for example
// when the link was opened in a new tab — it goes to `fallbackHref` instead.

const STORAGE_KEY = "pages-visited";
// Last counted page (without language), so a language switch is not counted.
const LAST_PAGE_KEY = "pages-visited-last";

function readVisited() {
  try {
    return Number(sessionStorage.getItem(STORAGE_KEY) ?? 0);
  } catch {
    return 0;
  }
}

// Counts the pages visited in this tab. Mounted once in the site layout.
// The same page in the other language does not count as a new page (this
// component is also rebuilt by a language switch, hence the stored last page).
export function NavigationTracker() {
  const { path } = splitLocale(usePathname());

  useEffect(() => {
    try {
      if (sessionStorage.getItem(LAST_PAGE_KEY) === path) return;
      sessionStorage.setItem(LAST_PAGE_KEY, path);
      sessionStorage.setItem(STORAGE_KEY, String(readVisited() + 1));
    } catch {
      // Storage can be blocked (private mode); the fallback link still works.
    }
  }, [path]);

  return null;
}

type BackLinkProps = {
  fallbackHref: string;
  className?: string;
  children: ReactNode;
};

export function BackLink({ fallbackHref, className, children }: BackLinkProps) {
  const router = useRouter();
  const locale = useLocale();

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    // Let Ctrl/Cmd-click open the fallback page in a new tab as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;

    const hasPreviousPage = readVisited() > 1 && window.history.length > 1;
    if (hasPreviousPage) {
      event.preventDefault();
      router.back();
    }
  }

  return (
    <Link href={localizePath(locale, fallbackHref)} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
