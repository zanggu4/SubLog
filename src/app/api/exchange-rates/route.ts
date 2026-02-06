import { NextResponse } from "next/server";

const FALLBACK_RATES: Record<string, number> = {
  KRW: 1,
  USD: 0.00074,
  JPY: 0.11,
  EUR: 0.00068,
};

export async function GET() {
  try {
    const res = await fetch(
      "https://api.exchangerate-api.com/v4/latest/KRW",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Exchange rate API failed");

    const data = await res.json();
    const rates: Record<string, number> = {
      KRW: 1,
      USD: data.rates.USD,
      JPY: data.rates.JPY,
      EUR: data.rates.EUR,
    };

    return NextResponse.json({ rates, base: "KRW", updatedAt: data.date });
  } catch {
    return NextResponse.json({
      rates: FALLBACK_RATES,
      base: "KRW",
      updatedAt: null,
      fallback: true,
    });
  }
}
