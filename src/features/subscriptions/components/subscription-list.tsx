import type { Subscription } from "@/features/subscriptions/types";
import { SubscriptionCard } from "./subscription-card";

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <p>아직 등록된 구독이 없습니다.</p>
        <p className="text-sm mt-1">위의 &quot;구독 추가&quot; 버튼으로 시작하세요.</p>
      </div>
    );
  }

  const active = subscriptions.filter((s) => s.status === "active");
  const cancelled = subscriptions.filter((s) => s.status === "cancelled");

  return (
    <div className="space-y-3">
      {active.map((s) => (
        <SubscriptionCard key={s.id} subscription={s} />
      ))}
      {cancelled.map((s) => (
        <SubscriptionCard key={s.id} subscription={s} />
      ))}
    </div>
  );
}
