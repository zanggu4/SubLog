"use client";

import { CreditCard } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

export function DashboardTitle() {
  const { t } = useSettings();

  return (
    <h2 className="text-xl font-bold flex items-center gap-2">
      <CreditCard size={20} className="text-primary" />
      {t.subs.title}
    </h2>
  );
}
