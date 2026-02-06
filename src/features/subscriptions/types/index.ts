import { z } from "zod";

export const SubscriptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  currency: z.enum(["KRW", "USD", "JPY", "EUR"]).default("KRW"),
  cycle: z.enum(["monthly", "yearly"]),
  billing_day: z.number().int().min(1).max(31),
  status: z.enum(["active", "paused", "cancelled"]),
  pausedUntil: z.string().datetime().optional(),
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
