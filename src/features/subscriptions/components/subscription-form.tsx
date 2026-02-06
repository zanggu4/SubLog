"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function SubscriptionForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name") as string,
      price: Number(form.get("price")),
      cycle: form.get("cycle") as string,
      billing_day: Number(form.get("billing_day")),
    };

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create");
      }

      setToast(`${body.name} 구독 추가 완료. 커밋 생성됨.`);
      setTimeout(() => setToast(null), 3000);
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류 발생");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>+ 구독 추가</Button>
    );
  }

  return (
    <>
      <Card>
        <h3 className="font-semibold mb-4">새 구독 추가</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">서비스명</label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              placeholder="Netflix"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">금액 (원)</label>
              <input
                name="price"
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                placeholder="17000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">결제 주기</label>
              <select
                name="cycle"
                required
                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              >
                <option value="monthly">월간</option>
                <option value="yearly">연간</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">결제일</label>
            <input
              name="billing_day"
              type="number"
              required
              min="1"
              max="31"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
              placeholder="15"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "추가 중..." : "추가"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
          </div>
        </form>
      </Card>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded-lg text-sm shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
