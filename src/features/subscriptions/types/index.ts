import { z } from "zod";

export const CATEGORIES = [
  "entertainment",
  "development",
  "cloud",
  "productivity",
  "music",
  "shopping",
  "news",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_CONFIG: Record<Category, { color: string; icon: string }> = {
  entertainment: { color: "#EF4444", icon: "🎬" },
  development: { color: "#8B5CF6", icon: "💻" },
  cloud: { color: "#3B82F6", icon: "☁️" },
  productivity: { color: "#10B981", icon: "📋" },
  music: { color: "#EC4899", icon: "🎵" },
  shopping: { color: "#F59E0B", icon: "🛒" },
  news: { color: "#6366F1", icon: "📰" },
  other: { color: "#6B7280", icon: "📦" },
};

export const SubscriptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  currency: z.enum(["KRW", "USD", "JPY", "EUR"]).default("KRW"),
  cycle: z.enum(["monthly", "yearly"]),
  billing_day: z.number().int().min(1).max(31),
  status: z.enum(["active", "paused", "cancelled"]),
  pausedUntil: z.string().datetime().optional(),
  category: z.enum(CATEGORIES).optional(),
});

export const CreateSubscriptionSchema = SubscriptionSchema.omit({
  id: true,
  status: true,
  pausedUntil: true,
});

export const UpdateSubscriptionSchema = CreateSubscriptionSchema.partial().extend({
  status: z.enum(["active", "paused"]).optional(),
  pausedUntil: z.string().datetime().nullable().optional(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
