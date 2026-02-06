"use client";

import { Activity, Wallet, CalendarRange } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import type { Subscription } from "@/features/subscriptions/types";

interface DashboardSummaryProps {
  subscriptions: Subscription[];
}

export function DashboardSummary({ subscriptions }: DashboardSummaryProps) {
  const { t, convertAndFormat } = useSettings();
  const active = subscriptions.filter((s) => s.status === "active");
  const monthlyTotal = active.reduce((sum, s) => {
    if (s.cycle === "yearly") return sum + Math.round(s.price / 12);
    return sum + s.price;
  }, 0);
  const yearlyTotal = active.reduce((sum, s) => {
    if (s.cycle === "monthly") return sum + s.price * 12;
    return sum + s.price;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card border border-border p-6 rounded-xl hover:border-muted/50 transition-all shadow-sm group">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-muted text-sm font-medium uppercase tracking-wider">
            {t.stats.active}
          </h3>
          <Activity
            size={20}
            className="text-muted group-hover:text-primary transition-colors"
          />
        </div>
        <div className="text-3xl font-bold tracking-tight font-mono">
          {active.length}
        </div>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl hover:border-muted/50 transition-all shadow-sm group">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-muted text-sm font-medium uppercase tracking-wider">
            {t.stats.monthly}
          </h3>
          <Wallet
            size={20}
            className="text-muted group-hover:text-primary transition-colors"
          />
        </div>
        <div className="text-3xl font-bold tracking-tight font-mono">
          {convertAndFormat(monthlyTotal)}
        </div>
        <p className="text-muted text-sm mt-2">{t.stats.monthlySub}</p>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl hover:border-muted/50 transition-all shadow-sm group">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-muted text-sm font-medium uppercase tracking-wider">
            {t.stats.yearly}
          </h3>
          <CalendarRange
            size={20}
            className="text-muted group-hover:text-primary transition-colors"
          />
        </div>
        <div className="text-3xl font-bold tracking-tight font-mono">
          {convertAndFormat(yearlyTotal)}
        </div>
        <p className="text-muted text-sm mt-2">{t.stats.yearlySub}</p>
      </div>
    </div>
  );
}
