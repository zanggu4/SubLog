import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { translations, type Language } from "@/lib/i18n";

const SUPPORTED_LANGS = ["en", "ko", "ja", "zh"];
const BASE_URL = "https://sublog.bbiero.dev";

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
    title: t.seo.loginTitle,
    description: t.seo.loginDescription,
    alternates: {
      canonical: `${BASE_URL}/${lang}/login`,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}/login`])
        ),
        "x-default": `${BASE_URL}/ko/login`,
      },
    },
  };
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const { lang } = await params;
  const validLang = SUPPORTED_LANGS.includes(lang) ? (lang as Language) : "ko";
  const t = translations[validLang];

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">SubLog</h1>
        <p className="text-muted mb-8">{t.seo.loginSubtitle}</p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
        >
          <button
            type="submit"
            className="bg-[#24292F] hover:bg-[#2b3137] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-black/20 mx-auto cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width={24} height={24} fill="white">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t.landing.loginButton}
          </button>
        </form>
      </div>
    </main>
  );
}
