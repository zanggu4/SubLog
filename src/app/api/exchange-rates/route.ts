import { NextResponse } from "next/server";

// Fallback rates (approximate, relative to USD)
const FALLBACK_USD_RATES: Record<string, number> = {
  USD: 1,
  KRW: 1350,
  JPY: 150,
  EUR: 0.92,
};

export async function GET() {
  try {
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Exchange rate API failed");

    const data = await res.json();
    const usdRates: Record<string, number> = {
      USD: 1,
      KRW: data.rates.KRW,
      JPY: data.rates.JPY,
      EUR: data.rates.EUR,
    };

    return NextResponse.json({
      rates: usdRates,
      base: "USD",
      updatedAt: data.date,
    });
  } catch {
    return NextResponse.json({
      rates: FALLBACK_USD_RATES,
      base: "USD",
      updatedAt: null,
      fallback: true,
    });
  }
}
