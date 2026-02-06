import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { translations, type Language } from "@/lib/i18n";
import { LangSync } from "@/components/lang-sync";

const SUPPORTED_LANGS = ["en", "ko", "ja", "zh"];
const BASE_URL = "https://sublog.bbiero.dev";

const LOCALE_MAP: Record<string, string> = {
  en: "en_US",
  ko: "ko_KR",
  ja: "ja_JP",
  zh: "zh_CN",
};

export async function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang)) return {};

  const t = translations[lang as Language];

  return {
    title: {
      default: t.seo.title,
      template: `%s | SubLog`,
    },
    description: t.seo.description,
    openGraph: {
      title: t.seo.title,
      description: t.seo.description,
      url: `${BASE_URL}/${lang}`,
      siteName: "SubLog",
      locale: LOCALE_MAP[lang],
      alternateLocale: SUPPORTED_LANGS.filter((l) => l !== lang).map(
        (l) => LOCALE_MAP[l]
      ),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.seo.title,
      description: t.seo.description,
    },
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}`])
        ),
        "x-default": `${BASE_URL}/ko`,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang)) notFound();

  return (
    <>
      <LangSync lang={lang as Language} />
      {children}
    </>
  );
}
