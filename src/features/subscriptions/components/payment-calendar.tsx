"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { currencies, formatCurrency } from "@/lib/currency";
import { CATEGORY_CONFIG, type Category, type Subscription } from "@/features/subscriptions/types";

interface PaymentCalendarProps {
  subscriptions: Subscription[];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function clampDay(day: number, maxDays: number): number {
  return Math.min(day, maxDays);
}

interface DayPayment {
  name: string;
  amount: number;
  color: string;
}

export function PaymentCalendar({ subscriptions }: PaymentCalendarProps) {
  const { t, displayCurrency, convertAmount } = useSettings();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const active = subscriptions.filter((s) => s.status === "active");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  // Build payments per day
  const dayPayments: Record<number, DayPayment[]> = {};

  active.forEach((s) => {
    const cur = (s.currency ?? "KRW") as "KRW" | "USD" | "JPY" | "EUR";
    const amount = convertAmount(s.price, cur);
    const catColor = CATEGORY_CONFIG[(s.category ?? "other") as Category]?.color ?? "#6B7280";

    if (s.cycle === "monthly") {
      const day = clampDay(s.billing_day, daysInMonth);
      if (!dayPayments[day]) dayPayments[day] = [];
      dayPayments[day].push({ name: s.name, amount, color: catColor });
    } else {
      // yearly
      const billingMonth = s.billing_month;
      if (billingMonth !== undefined) {
        // Only show in the specific month (billing_month is 1-indexed)
        if (viewMonth === billingMonth - 1) {
          const day = clampDay(s.billing_day, daysInMonth);
          if (!dayPayments[day]) dayPayments[day] = [];
          dayPayments[day].push({ name: s.name, amount, color: catColor });
        }
      } else {
        // Legacy fallback: no billing_month, show every month
        const day = clampDay(s.billing_day, daysInMonth);
        if (!dayPayments[day]) dayPayments[day] = [];
        dayPayments[day].push({ name: s.name, amount, color: catColor });
      }
    }
  });

  const weekDays = [
    t.calendar.sun,
    t.calendar.mon,
    t.calendar.tue,
    t.calendar.wed,
    t.calendar.thu,
    t.calendar.fri,
    t.calendar.sat,
  ];

  const fmt = (amount: number) =>
    formatCurrency(amount, currencies[displayCurrency]);

  const isToday = (day: number) =>
    viewYear === today.getFullYear() &&
    viewMonth === today.getMonth() &&
    day === today.getDate();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long" }
  );

  // Generate calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  // Pad to complete the last week
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-background border border-border text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-bold text-lg">{monthLabel}</h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-background border border-border text-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {/* Header */}
        {weekDays.map((d) => (
          <div
            key={d}
            className="bg-card text-center text-xs font-medium text-muted py-2"
          >
            {d}
          </div>
        ))}

        {/* Days */}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="bg-background min-h-[80px] md:min-h-[100px]" />;
          }

          const payments = dayPayments[day] ?? [];
          const dayTotal = payments.reduce((sum, p) => sum + p.amount, 0);
          const isCurrentDay = isToday(day);
          const maxShow = 3;

          return (
            <div
              key={day}
              className={`bg-card min-h-[80px] md:min-h-[100px] p-1.5 flex flex-col ${
                isCurrentDay ? "ring-2 ring-primary ring-inset" : ""
              }`}
            >
              <div
                className={`text-xs font-mono mb-1 ${
                  isCurrentDay
                    ? "bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center"
                    : "text-muted"
                }`}
              >
                {day}
              </div>

              <div className="flex-1 space-y-0.5 overflow-hidden">
                {payments.slice(0, maxShow).map((p, j) => (
                  <div
                    key={j}
                    className="text-[10px] leading-tight truncate px-1 py-0.5 rounded"
                    style={{ backgroundColor: p.color + "15", color: p.color }}
                  >
                    {p.name}
                  </div>
                ))}
                {payments.length > maxShow && (
                  <div className="text-[10px] text-muted px-1">
                    +{payments.length - maxShow}
                  </div>
                )}
              </div>

              {dayTotal > 0 && (
                <div className="text-[10px] font-mono text-muted mt-auto pt-0.5 truncate">
                  {fmt(dayTotal)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
