"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/settings-context";
import type { Language } from "@/lib/i18n";

export function LangSync({ lang }: { lang: Language }) {
  const { setLanguage } = useSettings();

  useEffect(() => {
    setLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, setLanguage]);

  return null;
}
