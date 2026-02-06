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
  /** All rates relative to USD. e.g. { USD: 1, KRW: 1350, JPY: 150, EUR: 0.92 } */
  rates: Record<string, number>;
  updatedAt: string | null;
}

interface SettingsContextValue {
  theme: "light" | "dark";
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  displayCurrency: CurrencyCode;
  setDisplayCurrency: (code: CurrencyCode) => void;
  /** Format amount in its original currency */
  formatOriginal: (amount: number, fromCurrency: CurrencyCode) => string;
  /** Convert from any currency to display currency and format */
  convertToDisplay: (amount: number, fromCurrency: CurrencyCode) => string;
  /** Convert raw number from any currency to display currency */
  convertAmount: (amount: number, fromCurrency: CurrencyCode) => number;
  exchangeRates: ExchangeRates | null;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<Language>("ko");
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("KRW");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(
    null
  );

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
    if (savedCurrency) setDisplayCurrency(savedCurrency);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("sublog-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("sublog-lang", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("sublog-currency", displayCurrency);
  }, [displayCurrency]);

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

  /** Convert amount from one currency to another using USD-based rates */
  const convertAmount = (
    amount: number,
    fromCurrency: CurrencyCode
  ): number => {
    if (fromCurrency === displayCurrency) return amount;
    if (!exchangeRates) return amount;

    const fromRate = exchangeRates.rates[fromCurrency] ?? 1;
    const toRate = exchangeRates.rates[displayCurrency] ?? 1;
    // from → USD → to
    return (amount / fromRate) * toRate;
  };

  const formatOriginal = (
    amount: number,
    fromCurrency: CurrencyCode
  ): string => {
    return formatCurrency(amount, currencies[fromCurrency]);
  };

  const convertToDisplay = (
    amount: number,
    fromCurrency: CurrencyCode
  ): string => {
    const converted = convertAmount(amount, fromCurrency);
    return formatCurrency(converted, currencies[displayCurrency]);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        toggleTheme,
        language,
        setLanguage,
        t: translations[language],
        displayCurrency,
        setDisplayCurrency,
        formatOriginal,
        convertToDisplay,
        convertAmount,
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
