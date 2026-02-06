"use client";

import { CreditCard } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import type { Subscription } from "@/features/subscriptions/types";
import { SubscriptionCard } from "./subscription-card";

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const { t } = useSettings();

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

  const statusOrder: Record<string, number> = {
    active: 0,
    paused: 1,
    cancelled: 2,
  };

  const sorted = [...subscriptions].sort((a, b) => {
    const statusDiff = (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9);
    if (statusDiff !== 0) return statusDiff;
    return b.price - a.price;
  });

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((s) => (
        <SubscriptionCard key={s.id} subscription={s} />
      ))}
    </div>
  );
}
