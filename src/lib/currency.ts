export type CurrencyCode = "KRW" | "USD" | "JPY" | "EUR";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  locale: string;
  decimals: number;
}

export const currencies: Record<CurrencyCode, CurrencyConfig> = {
  KRW: { code: "KRW", symbol: "₩", locale: "ko-KR", decimals: 0 },
  USD: { code: "USD", symbol: "$", locale: "en-US", decimals: 2 },
  JPY: { code: "JPY", symbol: "¥", locale: "ja-JP", decimals: 0 },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE", decimals: 2 },
};

export function formatCurrency(
  amount: number,
  currency: CurrencyConfig
): string {
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(amount);
}
