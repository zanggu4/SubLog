"use client";

import { useState } from "react";
import { List, CalendarDays } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { DashboardTitle } from "./dashboard-title";
import { SubscriptionForm } from "./subscription-form";
import { SubscriptionList } from "./subscription-list";
import { PaymentCalendar } from "./payment-calendar";
import type { Subscription } from "@/features/subscriptions/types";

interface DashboardContentProps {
  subscriptions: Subscription[];
}

export function DashboardContent({ subscriptions }: DashboardContentProps) {
  const { t } = useSettings();
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardTitle />
        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border">
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              view === "list"
                ? "bg-primary text-white shadow"
                : "text-muted hover:text-foreground"
            }`}
            title={t.calendar.listView}
          >
            <List size={18} />
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`p-2 rounded-md transition-colors cursor-pointer ${
              view === "calendar"
                ? "bg-primary text-white shadow"
                : "text-muted hover:text-foreground"
            }`}
            title={t.calendar.calendarView}
          >
            <CalendarDays size={18} />
          </button>
        </div>
      </div>

      <SubscriptionForm />

      {view === "list" ? (
        <SubscriptionList subscriptions={subscriptions} />
      ) : (
        <PaymentCalendar subscriptions={subscriptions} />
      )}
    </div>
  );
}
