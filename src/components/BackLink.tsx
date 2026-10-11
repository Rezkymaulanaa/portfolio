"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

// "Back" button that returns to the previous page on this site (with its
// scroll position). If there is no previous page on this site — for example
// when the link was opened in a new tab — it goes to `fallbackHref` instead.

const STORAGE_KEY = "pages-visited";

function readVisited() {
  try {
    return Number(sessionStorage.getItem(STORAGE_KEY) ?? 0);
  } catch {
    return 0;
  }
}

// Counts the pages visited in this tab. Mounted once in the site layout.
export function NavigationTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, String(readVisited() + 1));
    } catch {
      // Storage can be blocked (private mode); the fallback link still works.
    }
  }, [pathname]);

  return null;
}

type BackLinkProps = {
  fallbackHref: string;
  className?: string;
  children: ReactNode;
};

export function BackLink({ fallbackHref, className, children }: BackLinkProps) {
  const router = useRouter();

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
    <Link href={fallbackHref} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
