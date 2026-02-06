"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { Dialog } from "@/components/ui/dialog";
import { AutocompleteInput } from "./autocomplete-input";
import { knownServices } from "../data/known-services";
import type { Subscription } from "@/features/subscriptions/types";

const serviceOptions = knownServices.map((s) => ({
  label: s.name,
  searchTerms: [s.name.toLowerCase(), ...(s.aliases ?? []).map((a) => a.toLowerCase())],
}));

interface EditSubscriptionDialogProps {
  subscription: Subscription;
  open: boolean;
  onClose: () => void;
}

export function EditSubscriptionDialog({
  subscription,
  open,
  onClose,
}: EditSubscriptionDialogProps) {
  const router = useRouter();
  const { t } = useSettings();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name") as string,
      price: Number(form.get("price")),
      currency: form.get("currency") as string,
      cycle: form.get("cycle") as string,
      billing_day: Number(form.get("billing_day")),
    };

    try {
      const res = await fetch(`/api/subscriptions/${subscription.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to update");
      }

      setToast(t.subs.editSuccess);
      setTimeout(() => setToast(null), 3000);
      onClose();
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        title={t.subs.editDialogTitle}
        hideFooter
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              {t.form.nameLabel}
            </label>
            <AutocompleteInput
              name="name"
              required
              defaultValue={subscription.name}
              options={serviceOptions}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                {t.currency.label}
              </label>
              <select
                name="currency"
                defaultValue={subscription.currency ?? "KRW"}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
              >
                <option value="KRW">₩ KRW</option>
                <option value="USD">$ USD</option>
                <option value="JPY">¥ JPY</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                {t.form.priceLabel}
              </label>
              <input
                name="price"
                type="number"
                required
                min="1"
                step="any"
                defaultValue={subscription.price}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                {t.form.billingDayLabel}
              </label>
              <input
                name="billing_day"
                type="number"
                required
                min="1"
                max="31"
                defaultValue={subscription.billing_day}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              {t.form.cycleLabel}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-background p-1 rounded-lg border border-border">
              <label className="has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:shadow-lg py-2 text-sm font-medium rounded-md transition-all text-center cursor-pointer text-muted hover:text-foreground">
                <input
                  type="radio"
                  name="cycle"
                  value="monthly"
                  defaultChecked={subscription.cycle === "monthly"}
                  className="sr-only"
                />
                {t.form.monthly}
              </label>
              <label className="has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:shadow-lg py-2 text-sm font-medium rounded-md transition-all text-center cursor-pointer text-muted hover:text-foreground">
                <input
                  type="radio"
                  name="cycle"
                  value="yearly"
                  defaultChecked={subscription.cycle === "yearly"}
                  className="sr-only"
                />
                {t.form.yearly}
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              {t.form.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-6 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              {t.form.saveBtn}
            </button>
          </div>
        </form>
      </Dialog>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded-lg text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}
