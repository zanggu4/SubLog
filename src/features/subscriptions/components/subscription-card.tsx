"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { Dialog } from "@/components/ui/dialog";
import type { Subscription } from "@/features/subscriptions/types";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const router = useRouter();
  const { t, convertAndFormat } = useSettings();
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
      setToast(
        `${subscription.name} — ${t.subs.statusCancelled}`
      );
      setTimeout(() => setToast(null), 3000);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
      setCancelOpen(false);
    }
  }

  return (
    <>
      <div
        className={`
          relative overflow-hidden rounded-xl border p-5 transition-all
          ${
            isCancelled
              ? "bg-background border-border opacity-60"
              : "bg-card border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          }
        `}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{subscription.name}</h3>
            <div
              className={`
                inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border
                ${
                  isCancelled
                    ? "bg-border text-muted border-border"
                    : "bg-success/10 text-success border-success/20"
                }
              `}
            >
              {isCancelled ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
              {isCancelled ? t.subs.statusCancelled : t.subs.statusActive}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-bold">
              {convertAndFormat(subscription.price)}
            </div>
            <div className="text-xs text-muted uppercase tracking-wide">
              / {subscription.cycle === "monthly" ? t.form.monthly : t.form.yearly}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted mb-4">
          <Calendar size={14} />
          <span>
            {t.subs.billsOn}{" "}
            <span className="text-foreground font-mono">
              {subscription.billing_day}
            </span>
          </span>
        </div>

        {!isCancelled && (
          <button
            onClick={() => setCancelOpen(true)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-border text-muted hover:bg-danger/5 hover:text-danger hover:border-danger/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            {loading ? t.subs.committing : t.subs.cancelBtn}
          </button>
        )}
      </div>

      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title={t.subs.cancelDialogTitle}
        onConfirm={handleCancel}
        confirmLabel={t.subs.cancelBtn}
        confirmVariant="danger"
      >
        <p>
          <strong>{subscription.name}</strong>
          <br />
          {t.subs.cancelConfirm.replace("{name}", subscription.name)}
          <br />
          <span className="text-sm text-muted">
            {t.subs.cancelDialogCommitNote}
          </span>
        </p>
      </Dialog>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded-lg text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}
