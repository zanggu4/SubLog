"use client";

import { Activity, Wallet, CalendarRange } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { currencies, formatCurrency } from "@/lib/currency";
import type { Subscription } from "@/features/subscriptions/types";

interface DashboardSummaryProps {
  subscriptions: Subscription[];
}

export function DashboardSummary({ subscriptions }: DashboardSummaryProps) {
  const { t, displayCurrency, convertAmount } = useSettings();
  const active = subscriptions.filter((s) => s.status === "active");
  const pausedCount = subscriptions.filter((s) => s.status === "paused").length;

  const monthlyTotal = active.reduce((sum, s) => {
    const cur = (s.currency ?? "KRW") as "KRW" | "USD" | "JPY" | "EUR";
    const monthly = s.cycle === "yearly" ? s.price / 12 : s.price;
    return sum + convertAmount(monthly, cur);
  }, 0);

  const yearlyTotal = active.reduce((sum, s) => {
    const cur = (s.currency ?? "KRW") as "KRW" | "USD" | "JPY" | "EUR";
    const yearly = s.cycle === "monthly" ? s.price * 12 : s.price;
    return sum + convertAmount(yearly, cur);
  }, 0);

  const fmt = (amount: number) =>
    formatCurrency(amount, currencies[displayCurrency]);

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
        {pausedCount > 0 && (
          <p className="text-muted text-sm mt-2">
            {t.stats.paused}: {pausedCount}
          </p>
        )}
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
          {fmt(monthlyTotal)}
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
          {fmt(yearlyTotal)}
        </div>
        <p className="text-muted text-sm mt-2">{t.stats.yearlySub}</p>
      </div>
    </div>
  );
}
