import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Import the product arrays directly to avoid environment evaluation issues
const testModeProducts = [
  {
    id: "basic-monthly",
    name: "Basic Plan",
    description: "Perfect for getting started",
    stripePriceId: "price_1Rvl5u9s881ETZA7iVC1tLBm",
    stripeProductId: "prod_SrU3HkBWVNbU2o",
    price: 999,
    currency: "usd",
    type: "subscription" as const,
    interval: "month" as const,
    features: [
      "Up to 5 projects",
      "Basic templates",
      "Email support",
      "1GB storage"
    ],
    popular: false,
  },
  {
    id: "pro-monthly",
    name: "Pro Plan",
    description: "For growing businesses",
    stripePriceId: "price_1Rvl5v9s881ETZA7AmMgKS0U",
    stripeProductId: "prod_SrU3d4AQmYSuZu",
    price: 2999,
    currency: "usd",
    type: "subscription" as const,
    interval: "month" as const,
    features: [
      "Unlimited projects",
      "Premium templates",
      "Priority support",
      "10GB storage",
      "Advanced analytics",
      "Team collaboration"
    ],
    popular: true,
  },
  {
    id: "enterprise-monthly",
    name: "Enterprise Plan",
    description: "Full-featured plan for large teams",
    stripePriceId: "price_1Rvl5v9s881ETZA76ipi2VhK",
    stripeProductId: "prod_SrU3tFyF2GxjsV",
    price: 9999,
    currency: "usd",
    type: "subscription" as const,
    interval: "month" as const,
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "100GB storage",
      "Advanced security",
      "Custom branding",
      "API access",
      "SSO integration"
    ],
    popular: false,
  },
  {
    id: "template-pack",
    name: "Premium Template Pack",
    description: "50 premium templates for your projects",
    stripePriceId: "price_1Rvl649s881ETZA7SvB8Mytj",
    stripeProductId: "prod_SrU4kMxpJdsf8F",
    price: 4999,
    currency: "usd",
    type: "one_time" as const,
    features: [
      "50+ premium templates",
      "Commercial license",
      "Photoshop files included",
      "Lifetime updates"
    ],
  },
  {
    id: "priority-support",
    name: "Priority Support",
    description: "1-month priority email and chat support",
    stripePriceId: "price_1Rvl649s881ETZA72mhmnPhb",
    stripeProductId: "prod_SrU4rBEAWXw0L6",
    price: 1999,
    currency: "usd",
    type: "one_time" as const,
    features: [
      "Priority email support",
      "Live chat support",
      "1-month duration",
      "Expert assistance"
    ],
  },
];

function getStripeProductsForEnv() {
  // Always use test mode products in development for now
  return testModeProducts;
}

export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return getStripeProductsForEnv();
  },
});

export const getSubscriptionPlans = query({
  args: {},
  handler: async (ctx) => {
    return getStripeProductsForEnv().filter(product => product.type === "subscription");
  },
});

export const getOneTimeProducts = query({
  args: {},
  handler: async (ctx) => {
    return getStripeProductsForEnv().filter(product => product.type === "one_time");
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