import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  subscriptions: defineTable({
    userId: v.id("users"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("incomplete"),
      v.literal("incomplete_expired"),
      v.literal("past_due"),
      v.literal("trialing"),
      v.literal("unpaid")
    ),
    priceId: v.string(),
    planName: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),

  payments: defineTable({
    userId: v.id("users"),
    stripePaymentIntentId: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("succeeded"),
      v.literal("pending"),
      v.literal("failed"),
      v.literal("canceled")
    ),
    type: v.union(v.literal("subscription"), v.literal("one_time")),
    description: v.string(),
  }).index("by_user", ["userId"])
    .index("by_payment_intent", ["stripePaymentIntentId"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    stripePriceId: v.string(),
    stripeProductId: v.string(),
    price: v.number(),
    currency: v.string(),
    type: v.union(v.literal("subscription"), v.literal("one_time")),
    interval: v.optional(v.union(v.literal("month"), v.literal("year"))),
    features: v.array(v.string()),
    popular: v.optional(v.boolean()),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
