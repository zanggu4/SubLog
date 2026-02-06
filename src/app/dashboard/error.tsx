"use client";

import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/ui/button";

const errorMessages = {
  en: { title: "Something went wrong", retry: "Try Again" },
  ko: { title: "문제가 발생했습니다", retry: "다시 시도" },
  ja: { title: "問題が発生しました", retry: "再試行" },
  zh: { title: "出现了问题", retry: "重试" },
} as const;

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { language } = useSettings();
  const msg = errorMessages[language] ?? errorMessages.ko;

  if (process.env.NODE_ENV === "development") {
    console.error("[DashboardError]", error);
  }

  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-semibold mb-2">{msg.title}</h2>
      <Button onClick={reset}>{msg.retry}</Button>
    </div>
  );
}
