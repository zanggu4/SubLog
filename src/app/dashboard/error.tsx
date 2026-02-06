"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-16">
      <h2 className="text-xl font-semibold mb-2">문제가 발생했습니다</h2>
      <p className="text-muted mb-6">{error.message}</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
