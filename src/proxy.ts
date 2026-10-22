import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./i18n/config";

// Runs before every page request and picks the language:
// - /id/...  → Indonesian page, as it is.
// - /en/...  → redirected to the same address without /en (English lives at /).
// - other    → English page (served from /en/... behind the scenes), unless
//   the visitor prefers Indonesian: a language picked earlier with the
//   EN | ID switch (cookie), or else the browser language. Then → /id/...
// Search engines send no language preference, so they always get English.

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/id" || pathname.startsWith("/id/")) return NextResponse.next();

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    // Share images of English pages are generated under /en; serve them as they are.
    if (pathname.includes("/opengraph-image")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (preferredLocale(request) === "id") {
    const url = request.nextUrl.clone();
    url.pathname = `/id${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;
  return browserLocale(request.headers.get("accept-language"));
}

// Best match from a header like "id-ID,id;q=0.9,en-US;q=0.8".
// "in" is the old code for Indonesian that some devices still send.
function browserLocale(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = Number(params.find((param) => param.trim().startsWith("q="))?.split("=")[1] ?? 1);
      return { language: tag.split("-")[0], q: Number.isFinite(q) ? q : 0 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { language } of ranked) {
    if (language === "id" || language === "in") return "id";
    if (language === "en") return "en";
  }
  return DEFAULT_LOCALE;
}

export const config = {
  // Not for the Studio, Next.js files, the icons, or files with an extension
  // (sitemap.xml, robots.txt, images).
  matcher: ["/((?!studio|_next|api|icon|apple-icon|.*\\.).*)"],
};
