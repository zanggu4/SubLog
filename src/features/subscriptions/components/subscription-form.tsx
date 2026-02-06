"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { AutocompleteInput } from "./autocomplete-input";
import { knownServices } from "../data/known-services";
import { CATEGORIES, CATEGORY_CONFIG } from "../types";

const serviceOptions = knownServices.map((s) => ({
  label: s.name,
  searchTerms: [s.name.toLowerCase(), ...(s.aliases ?? []).map((a) => a.toLowerCase())],
}));

export function SubscriptionForm() {
  const router = useRouter();
  const { t } = useSettings();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const category = form.get("category") as string;
    const body: Record<string, unknown> = {
      name: form.get("name") as string,
      price: Number(form.get("price")),
      currency: form.get("currency") as string,
      cycle: form.get("cycle") as string,
      billing_day: Number(form.get("billing_day")),
    };
    if (category) body.category = category;
    const billingMonth = form.get("billing_month") as string;
    if (billingMonth) body.billing_month = Number(billingMonth);

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

      setToast(`${body.name} — committed`);
      setTimeout(() => setToast(null), 3000);
      setOpen(false);
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 border-2 border-dashed border-border rounded-xl text-muted hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <div className="bg-border p-1 rounded-md group-hover:bg-primary/20 transition-colors">
          <Plus size={20} />
        </div>
        <span className="font-medium">{t.form.addBtn}</span>
      </button>
    );
  }

  return (
    <>
      <div className="bg-card rounded-xl border border-border p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">{t.form.title}</h3>
          <button
            onClick={() => setOpen(false)}
            className="text-muted hover:text-foreground text-sm cursor-pointer"
          >
            {t.form.cancel}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              {t.form.nameLabel}
            </label>
            <AutocompleteInput
              name="name"
              required
              autoFocus
              placeholder={t.form.namePlaceholder}
              options={serviceOptions}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1.5">
                {t.currency.label}
              </label>
              <select
                name="currency"
                defaultValue="KRW"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
              >
                <option value="KRW">₩ KRW</option>
                <option value="USD">$ USD</option>
                <option value="JPY">¥ JPY</option>
                <option value="EUR">€ EUR</option>
                <option value="CNY">¥ CNY</option>
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
                placeholder="17000"
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
                  defaultChecked
                  onChange={() => setCycle("monthly")}
                  className="sr-only"
                />
                {t.form.monthly}
              </label>
              <label className="has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:shadow-lg py-2 text-sm font-medium rounded-md transition-all text-center cursor-pointer text-muted hover:text-foreground">
                <input
                  type="radio"
                  name="cycle"
                  value="yearly"
                  onChange={() => setCycle("yearly")}
                  className="sr-only"
                />
                {t.form.yearly}
              </label>
            </div>
          </div>

          <div className={`grid gap-4 ${cycle === "yearly" ? "grid-cols-2" : "grid-cols-1"}`}>
            {cycle === "yearly" && (
              <div>
                <label className="block text-sm font-medium text-muted mb-1.5">
                  {t.form.billingMonthLabel}
                </label>
                <select
                  name="billing_month"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option value="">-</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
                defaultValue="1"
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">
              {t.form.categoryLabel}
            </label>
            <select
              name="category"
              defaultValue=""
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            >
              <option value="">{t.form.categoryPlaceholder}</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].icon} {t.categories[cat as keyof typeof t.categories]}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Plus size={20} />
            )}
            {t.form.submit}
          </button>
        </form>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-foreground text-background px-4 py-2 rounded-lg text-sm shadow-lg z-50">
          {toast}
        </div>
      )}
    </>
  );
}
