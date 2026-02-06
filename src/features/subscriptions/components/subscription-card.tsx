"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Trash2,
  CheckCircle2,
  XCircle,
  Pencil,
  CirclePause,
  CirclePlay,
} from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { Dialog } from "@/components/ui/dialog";
import { EditSubscriptionDialog } from "./edit-subscription-dialog";
import { CATEGORY_CONFIG, type Category, type Subscription } from "@/features/subscriptions/types";

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const router = useRouter();
  const { t, displayCurrency, formatOriginal, convertToDisplay } =
    useSettings();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isCancelled = subscription.status === "cancelled";
  const isPaused = subscription.status === "paused";
  const isActive = subscription.status === "active";

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
      setToast(`${subscription.name} — ${t.subs.statusCancelled}`);
      setTimeout(() => setToast(null), 3000);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
      setCancelOpen(false);
    }
  }

  async function handlePause(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const pausedUntilValue = form.get("pausedUntil") as string;

    const body: Record<string, unknown> = { status: "paused" };
    if (pausedUntilValue) {
      body.pausedUntil = new Date(pausedUntilValue).toISOString();
    }

    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to pause");
      }
      setToast(`${subscription.name} — ${t.subs.statusPaused}`);
      setTimeout(() => setToast(null), 3000);
      setPauseOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResume() {
    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active", pausedUntil: null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to resume");
      }
      setToast(`${subscription.name} — ${t.subs.statusActive}`);
      setTimeout(() => setToast(null), 3000);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const statusBadge = isCancelled ? (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-border text-muted border-border">
      <XCircle size={12} />
      {t.subs.statusCancelled}
    </div>
  ) : isPaused ? (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400">
      <CirclePause size={12} />
      {t.subs.statusPaused}
    </div>
  ) : (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-success/10 text-success border-success/20">
      <CheckCircle2 size={12} />
      {t.subs.statusActive}
    </div>
  );

  return (
    <>
      <div
        className={`
          relative overflow-hidden rounded-xl border p-5 transition-all
          ${
            isCancelled
              ? "bg-background border-border opacity-60"
              : isPaused
                ? "bg-card border-amber-500/30 opacity-80"
                : "bg-card border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
          }
        `}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg mb-1">{subscription.name}</h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {statusBadge}
              {subscription.category && (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: CATEGORY_CONFIG[subscription.category as Category]?.color + "15",
                    borderColor: CATEGORY_CONFIG[subscription.category as Category]?.color + "30",
                    color: CATEGORY_CONFIG[subscription.category as Category]?.color,
                  }}
                >
                  {CATEGORY_CONFIG[subscription.category as Category]?.icon}
                  {t.categories[subscription.category as keyof typeof t.categories]}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-xl font-bold">
              {formatOriginal(
                subscription.price,
                (subscription.currency ?? "KRW") as
                  | "KRW"
                  | "USD"
                  | "JPY"
                  | "EUR"
              )}
            </div>
            {(subscription.currency ?? "KRW") !== displayCurrency && (
              <div className="text-xs text-muted font-mono">
                {convertToDisplay(
                  subscription.price,
                  (subscription.currency ?? "KRW") as
                    | "KRW"
                    | "USD"
                    | "JPY"
                    | "EUR"
                )}
              </div>
            )}
            <div className="text-xs text-muted uppercase tracking-wide">
              /{" "}
              {subscription.cycle === "monthly"
                ? t.form.monthly
                : t.form.yearly}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <Calendar size={14} />
          <span>
            {t.subs.billsOn}{" "}
            <span className="text-foreground font-mono">
              {subscription.cycle === "yearly" && subscription.billing_month
                ? `${subscription.billing_month}/${subscription.billing_day}`
                : subscription.billing_day}
            </span>
          </span>
        </div>

        {isPaused && subscription.pausedUntil && (
          <div className="text-xs text-amber-600 dark:text-amber-400 mb-3">
            {t.subs.pausedUntil.replace(
              "{date}",
              new Date(subscription.pausedUntil).toLocaleDateString()
            )}
          </div>
        )}

        {!isPaused && !isCancelled && <div className="mb-3" />}

        {isActive && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border border-border text-muted hover:bg-primary/5 hover:text-primary hover:border-primary/30 cursor-pointer"
            >
              <Pencil size={16} />
              {t.subs.editBtn}
            </button>
            <button
              onClick={() => setPauseOpen(true)}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border border-border text-muted hover:bg-amber-500/5 hover:text-amber-600 hover:border-amber-500/30 disabled:opacity-50 cursor-pointer"
            >
              <CirclePause size={16} />
              {t.subs.pauseBtn}
            </button>
            <button
              onClick={() => setCancelOpen(true)}
              disabled={loading}
              className="col-span-2 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border border-border text-muted hover:bg-danger/5 hover:text-danger hover:border-danger/30 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={16} />
              {t.subs.cancelBtn}
            </button>
          </div>
        )}

        {isPaused && (
          <button
            onClick={handleResume}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <CirclePlay size={16} />
            )}
            {loading ? t.subs.committing : t.subs.resumeBtn}
          </button>
        )}
      </div>

      <EditSubscriptionDialog
        subscription={subscription}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />

      {/* Pause Dialog */}
      <Dialog
        open={pauseOpen}
        onClose={() => setPauseOpen(false)}
        title={t.subs.pauseDialogTitle}
        hideFooter
      >
        <form onSubmit={handlePause} className="space-y-4">
          <p className="text-sm text-muted">
            {t.subs.pauseConfirm.replace("{name}", subscription.name)}
          </p>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              {t.subs.pausedUntilLabel}
            </label>
            <input
              name="pausedUntil"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPauseOpen(false)}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {t.form.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <CirclePause size={16} />
              )}
              {t.subs.pauseBtn}
            </button>
          </div>
        </form>
      </Dialog>

      {/* Cancel Dialog */}
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
