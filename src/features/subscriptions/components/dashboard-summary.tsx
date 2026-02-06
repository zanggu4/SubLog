import { Card } from "@/components/ui/card";
import type { Subscription } from "@/features/subscriptions/types";

interface DashboardSummaryProps {
  subscriptions: Subscription[];
}

export function DashboardSummary({ subscriptions }: DashboardSummaryProps) {
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <p className="text-sm text-muted mb-1">활성 구독</p>
        <p className="text-2xl font-bold">{active.length}개</p>
      </Card>
      <Card>
        <p className="text-sm text-muted mb-1">월 예상 비용</p>
        <p className="text-2xl font-bold">
          {monthlyTotal.toLocaleString()}원
        </p>
      </Card>
      <Card>
        <p className="text-sm text-muted mb-1">연 예상 비용</p>
        <p className="text-2xl font-bold">
          {yearlyTotal.toLocaleString()}원
        </p>
      </Card>
    </div>
  );
}
