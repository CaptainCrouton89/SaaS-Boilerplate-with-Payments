import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getSubscriptionPlans = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("type"), "subscription"))
      .collect();
  },
});

export const getOneTimeProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("type"), "one_time"))
      .collect();
  },
});

export const createProduct = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});
