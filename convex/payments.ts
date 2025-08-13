import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const getUserPayments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const createPayment = mutation({
  args: {
    stripePaymentIntentId: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    type: v.union(v.literal("subscription"), v.literal("one_time")),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    return await ctx.db.insert("payments", {
      userId,
      stripePaymentIntentId: args.stripePaymentIntentId,
      amount: args.amount,
      currency: args.currency,
      status: args.status as any,
      type: args.type,
      description: args.description,
    });
  },
});

export const createCheckoutSession = action({
  args: {
    priceId: v.string(),
    type: v.union(v.literal("subscription"), v.literal("one_time")),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.runQuery(api.auth.loggedInUser);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // This would integrate with Stripe in a real implementation
    // For now, return a mock checkout URL
    return {
      url: `https://checkout.stripe.com/pay/mock-session-${args.priceId}`,
      sessionId: `cs_mock_${Date.now()}`,
    };
  },
});

export const createPortalSession = action({
  args: {},
  handler: async (ctx): Promise<{ url: string }> => {
    const userId = await ctx.runQuery(api.auth.loggedInUser);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const subscription: any = await ctx.runQuery(api.subscriptions.getUserSubscription);
    if (!subscription) {
      throw new Error("No subscription found");
    }

    // This would integrate with Stripe Customer Portal in a real implementation
    return {
      url: `https://billing.stripe.com/p/session/mock-portal-${subscription.stripeCustomerId}`,
    };
  },
});
