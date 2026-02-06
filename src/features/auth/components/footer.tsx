"use client";

import { useSettings } from "@/lib/settings-context";

export function DashboardFooter() {
  const { t } = useSettings();

  return (
    <footer className="py-8 text-center text-muted text-sm border-t border-border mt-12">
      <p>{t.footer.replace("{year}", new Date().getFullYear().toString())}</p>
    </footer>
  );
}
