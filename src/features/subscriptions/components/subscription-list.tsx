"use client";

import { useState } from "react";
import { CreditCard } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { CATEGORY_CONFIG, type Category, type Subscription } from "@/features/subscriptions/types";
import { SubscriptionCard } from "./subscription-card";

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const { t } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/30">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-border mb-4">
          <CreditCard className="text-muted" size={32} />
        </div>
        <h3 className="text-lg font-medium mb-1">{t.subs.emptyTitle}</h3>
        <p className="text-muted max-w-sm mx-auto">{t.subs.emptyDesc}</p>
      </div>
    );
  }

  // Build category counts (only active categories)
  const categoryCounts = subscriptions.reduce<Record<string, number>>(
    (acc, s) => {
      const cat = s.category ?? "other";
      acc[cat] = (acc[cat] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const activeCategories = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const filtered = selectedCategory
    ? subscriptions.filter(
        (s) => (s.category ?? "other") === selectedCategory
      )
    : subscriptions;

  const statusOrder: Record<string, number> = {
    active: 0,
    paused: 1,
    cancelled: 2,
  };

  const sorted = [...filtered].sort((a, b) => {
    const statusDiff =
      (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
    if (statusDiff !== 0) return statusDiff;
    return b.price - a.price;
  });

  return (
    <div className="space-y-4">
      {activeCategories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              selectedCategory === null
                ? "bg-primary text-white border-primary"
                : "bg-card text-muted border-border hover:border-primary/30"
            }`}
          >
            {t.categories.all} ({subscriptions.length})
          </button>
          {activeCategories.map(([cat, count]) => {
            const config = CATEGORY_CONFIG[cat as Category];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : cat)
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? "text-white"
                    : "bg-card text-muted border-border hover:border-primary/30"
                }`}
                style={
                  isSelected
                    ? { backgroundColor: config?.color, borderColor: config?.color }
                    : undefined
                }
              >
                {config?.icon}{" "}
                {t.categories[cat as keyof typeof t.categories] ?? cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((s) => (
          <SubscriptionCard key={s.id} subscription={s} />
        ))}
      </div>
    </div>
  );
}
