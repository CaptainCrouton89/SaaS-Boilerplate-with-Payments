import { mutation } from "./_generated/server";

export const initializeSampleProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return "Products already initialized";
    }

    // Subscription plans
    await ctx.db.insert("products", {
      name: "Starter",
      description: "Perfect for individuals getting started",
      stripePriceId: "price_starter_monthly",
      stripeProductId: "prod_starter",
      price: 999, // $9.99
      currency: "usd",
      type: "subscription",
      interval: "month",
      features: [
        "Up to 5 projects",
        "Basic analytics", 
        "Email support",
        "1GB storage"
      ],
    });

    await ctx.db.insert("products", {
      name: "Professional",
      description: "Best for growing businesses",
      stripePriceId: "price_pro_monthly", 
      stripeProductId: "prod_pro",
      price: 2999, // $29.99
      currency: "usd",
      type: "subscription",
      interval: "month",
      popular: true,
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support", 
        "10GB storage",
        "Team collaboration",
        "Custom integrations"
      ],
    });

    await ctx.db.insert("products", {
      name: "Enterprise",
      description: "For large organizations",
      stripePriceId: "price_enterprise_monthly",
      stripeProductId: "prod_enterprise", 
      price: 9999, // $99.99
      currency: "usd",
      type: "subscription",
      interval: "month",
      features: [
        "Everything in Professional",
        "Unlimited storage",
        "24/7 phone support",
        "Custom onboarding",
        "SLA guarantee",
        "Advanced security"
      ],
    });

    // One-time products
    await ctx.db.insert("products", {
      name: "Premium Templates",
      description: "Collection of 50+ premium templates",
      stripePriceId: "price_templates",
      stripeProductId: "prod_templates",
      price: 4999, // $49.99
      currency: "usd", 
      type: "one_time",
      features: [
        "50+ premium templates",
        "Commercial license",
        "Lifetime updates",
        "PSD & Figma files"
      ],
    });

    await ctx.db.insert("products", {
      name: "Advanced Training",
      description: "Comprehensive video course", 
      stripePriceId: "price_training",
      stripeProductId: "prod_training",
      price: 19999, // $199.99
      currency: "usd",
      type: "one_time",
      features: [
        "10+ hours of video content",
        "Downloadable resources", 
        "Certificate of completion",
        "Lifetime access"
      ],
    });

    return "Sample products initialized successfully";
  },
});
