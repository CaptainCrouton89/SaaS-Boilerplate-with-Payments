import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import Stripe from "stripe";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";

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
    const user = await ctx.runQuery(api.auth.loggedInUser);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { default: Stripe } = await import("stripe");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-07-30.basil",
    });

    const successUrl =
      process.env.STRIPE_SUCCESS_URL || `${process.env.SITE_URL}/dashboard`;
    const cancelUrl =
      process.env.STRIPE_CANCEL_URL || `${process.env.SITE_URL}/pricing`;

    try {
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        line_items: [
          {
            price: args.priceId,
            quantity: 1,
          },
        ],
        mode: args.type === "subscription" ? "subscription" : "payment",
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        customer_email: user.email || undefined,
        metadata: {
          userId: user._id,
          type: args.type,
        },
      };

      if (args.type === "subscription") {
        sessionParams.subscription_data = {
          metadata: {
            userId: user._id,
          },
        };
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      if (!session.url) {
        throw new Error("Failed to create checkout session URL");
      }

      return {
        url: session.url,
        sessionId: session.id,
      };
    } catch (error) {
      console.error("Stripe checkout session error:", error);
      throw new Error(
        `Failed to create checkout session: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
});

export const createPortalSession = action({
  args: {},
  handler: async (ctx): Promise<{ url: string }> => {
    const user = await ctx.runQuery(api.auth.loggedInUser);
    if (!user) {
      throw new Error("User not authenticated");
    }

    const subscription = await ctx.runQuery(
      api.subscriptions.getUserSubscription
    );
    if (!subscription) {
      throw new Error("No subscription found");
    }

    const { default: Stripe } = await import("stripe");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-07-30.basil",
    });

    const returnUrl =
      process.env.STRIPE_PORTAL_RETURN_URL ||
      `${process.env.SITE_URL}/dashboard`;

    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: returnUrl,
      });

      return {
        url: session.url,
      };
    } catch (error) {
      console.error("Stripe portal session error:", error);
      throw new Error(
        `Failed to create portal session: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  },
});
