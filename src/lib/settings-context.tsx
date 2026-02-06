"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { type Language, translations, type Translations } from "./i18n";
import {
  type CurrencyCode,
  type CurrencyConfig,
  currencies,
  formatCurrency,
} from "./currency";

interface ExchangeRates {
  rates: Record<string, number>;
  updatedAt: string | null;
}

interface SettingsContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  currencyCode: CurrencyCode;
  setCurrencyCode: (code: CurrencyCode) => void;
  currency: CurrencyConfig;
  convertAndFormat: (krwAmount: number) => string;
  exchangeRates: ExchangeRates | null;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<Language>("ko");
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>("KRW");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null
  );

  // Init from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("sublog-theme") as
      | "light"
      | "dark"
      | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }

    const savedLang = localStorage.getItem("sublog-lang") as Language | null;
    if (savedLang) {
      setLanguage(savedLang);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (["ko", "ja", "zh"].includes(browserLang)) {
        setLanguage(browserLang as Language);
      } else {
        setLanguage("en");
      }
    }

    const savedCurrency = localStorage.getItem(
      "sublog-currency"
    ) as CurrencyCode | null;
    if (savedCurrency) setCurrencyCode(savedCurrency);
  }, []);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("sublog-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("sublog-lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("sublog-currency", currencyCode);
  }, [currencyCode]);

  // Fetch exchange rates
  useEffect(() => {
    fetch("/api/exchange-rates")
      .then((res) => res.json())
      .then((data) =>
        setExchangeRates({ rates: data.rates, updatedAt: data.updatedAt })
      )
      .catch(() => {});
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const currency = currencies[currencyCode];

  const convertAndFormat = (krwAmount: number): string => {
    if (currencyCode === "KRW" || !exchangeRates) {
      return formatCurrency(krwAmount, currencies.KRW);
    }
    const rate = exchangeRates.rates[currencyCode] ?? 1;
    return formatCurrency(krwAmount * rate, currency);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        t: translations[language],
        currencyCode,
        setCurrencyCode,
        currency,
        convertAndFormat,
        exchangeRates,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
