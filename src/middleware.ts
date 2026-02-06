import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const SUPPORTED_LANGS = ["en", "ko", "ja", "zh"];
const DEFAULT_LANG = "ko";

function detectLanguage(request: Request & { cookies: { get: (name: string) => { value: string } | undefined } }): string {
  const cookieLang = request.cookies.get("sublog-lang")?.value;
  if (cookieLang && SUPPORTED_LANGS.includes(cookieLang)) return cookieLang;

  const acceptLang = request.headers.get("Accept-Language");
  if (acceptLang) {
    const preferred = acceptLang
      .split(",")
      .map((l) => l.split(";")[0].trim().slice(0, 2));
    const matched = preferred.find((l) => SUPPORTED_LANGS.includes(l));
    if (matched) return matched;
  }

  return DEFAULT_LANG;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Auth protection for protected routes
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/subscriptions") ||
    pathname.startsWith("/api/commits");

  if (isProtected && !req.auth) {
    const lang = detectLanguage(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}/login`;
    return NextResponse.redirect(url);
  }

  // Skip language routing for api and dashboard
  if (pathname.startsWith("/api") || pathname.startsWith("/dashboard")) {
    return;
  }

  // Already has valid language prefix
  const firstSegment = pathname.split("/")[1];
  if (SUPPORTED_LANGS.includes(firstSegment)) {
    return;
  }

  // Redirect to localized path
  const lang = detectLanguage(req);
  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${lang}` : `/${lang}${pathname}`;
  return NextResponse.redirect(url);
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api/auth|api/exchange-rates|favicon\\.ico|icon\\.svg|.*\\.\\w+$).*)",
  ],
};
