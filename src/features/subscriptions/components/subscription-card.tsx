"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { Subscription } from "@/features/subscriptions/types";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isCancelled = subscription.status === "cancelled";

  async function handleCancel() {
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to cancel");
      }
      setToast(`${subscription.name} 구독 해지 완료. 커밋 생성됨.`);
      setTimeout(() => setToast(null), 3000);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setLoading(false);
      setCancelOpen(false);
    }
  }

  return (
    <>
      <Card
        className={`flex items-center justify-between ${isCancelled ? "opacity-50" : ""}`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{subscription.name}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isCancelled
                  ? "bg-border text-muted"
                  : "bg-success/10 text-success"
              }`}
            >
              {isCancelled ? "해지됨" : "활성"}
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            {subscription.price.toLocaleString()}원 /{" "}
            {subscription.cycle === "monthly" ? "월" : "년"} &middot; 매월{" "}
            {subscription.billing_day}일 결제
          </p>
        </div>
        {!isCancelled && (
          <Button
            variant="danger"
            onClick={() => setCancelOpen(true)}
            disabled={loading}
          >
            해지
          </Button>
        )}
      </Card>

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="구독 해지"
        onConfirm={handleCancel}
        confirmLabel="해지하기"
        confirmVariant="danger"
      >
        <p>
          <strong>{subscription.name}</strong> 구독을 해지하시겠습니까?
          <br />
          <span className="text-sm text-muted">
            GitHub에 해지 커밋이 생성됩니다.
          </span>
        </p>
      </Dialog>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded-lg text-sm shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
