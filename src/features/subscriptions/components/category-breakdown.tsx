"use client";

import { useSettings } from "@/lib/settings-context";
import { currencies, formatCurrency, type CurrencyCode } from "@/lib/currency";
import {
  CATEGORY_CONFIG,
  type Category,
  type Subscription,
} from "@/features/subscriptions/types";

interface CategoryBreakdownProps {
  subscriptions: Subscription[];
}

export function CategoryBreakdown({ subscriptions }: CategoryBreakdownProps) {
  const { t, displayCurrency, convertAmount } = useSettings();

  const active = subscriptions.filter((s) => s.status === "active");

  const categoryTotals = active.reduce<Record<Category, number>>(
    (acc, s) => {
      const cat = (s.category ?? "other") as Category;
      const cur = (s.currency ?? "KRW") as CurrencyCode;
      const monthly = s.cycle === "yearly" ? s.price / 12 : s.price;
      acc[cat] = (acc[cat] ?? 0) + convertAmount(monthly, cur);
      return acc;
    },
    {} as Record<Category, number>
  );

  const sorted = Object.entries(categoryTotals)
    .filter(([, total]) => total > 0)
    .sort(([, a], [, b]) => b - a);

  if (sorted.length === 0) return null;

  const maxTotal = sorted[0][1];
  const fmt = (amount: number) =>
    formatCurrency(amount, currencies[displayCurrency]);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="font-bold">{t.categories.breakdown}</h3>
      </div>
      <div className="p-4 space-y-3">
        {sorted.map(([cat, total]) => {
          const config = CATEGORY_CONFIG[cat as Category];
          const categoryName =
            t.categories[cat as keyof typeof t.categories] ?? cat;
          const width = (total / maxTotal) * 100;

          return (
            <div key={cat}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm flex items-center gap-1.5">
                  <span>{config.icon}</span>
                  {categoryName}
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {fmt(total)}
                </span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${width}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
