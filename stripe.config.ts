/**
 * Stripe Configuration
 * 
 * This file contains product and price configurations for both test and production environments.
 * Test mode uses real Stripe test products/prices created with the CLI.
 * Production mode uses placeholder IDs that should be replaced with real production values.
 */

export interface ProductConfig {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  stripeProductId: string;
  price: number;
  currency: string;
  type: "subscription" | "one_time";
  interval?: "month" | "year";
  features: string[];
  popular?: boolean;
}

const testModeProducts: ProductConfig[] = [
  // Subscription Plans
  {
    id: "basic-monthly",
    name: "Basic Plan",
    description: "Perfect for getting started",
    stripePriceId: "price_1Rvl5u9s881ETZA7iVC1tLBm",
    stripeProductId: "prod_SrU3HkBWVNbU2o",
    price: 999,
    currency: "usd",
    type: "subscription",
    interval: "month",
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
    type: "subscription",
    interval: "month",
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
    type: "subscription",
    interval: "month",
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
  
  // One-time Products
  {
    id: "template-pack",
    name: "Premium Template Pack",
    description: "50 premium templates for your projects",
    stripePriceId: "price_1Rvl649s881ETZA7SvB8Mytj",
    stripeProductId: "prod_SrU4kMxpJdsf8F",
    price: 4999,
    currency: "usd",
    type: "one_time",
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
    type: "one_time",
    features: [
      "Priority email support",
      "Live chat support",
      "1-month duration",
      "Expert assistance"
    ],
  },
];

const productionModeProducts: ProductConfig[] = [
  // Subscription Plans - Replace with real production IDs
  {
    id: "basic-monthly",
    name: "Basic Plan",
    description: "Perfect for getting started",
    stripePriceId: "price_PROD_BASIC_MONTHLY_REPLACE_ME",
    stripeProductId: "prod_PROD_BASIC_REPLACE_ME",
    price: 999,
    currency: "usd",
    type: "subscription",
    interval: "month",
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
    stripePriceId: "price_PROD_PRO_MONTHLY_REPLACE_ME",
    stripeProductId: "prod_PROD_PRO_REPLACE_ME",
    price: 2999,
    currency: "usd",
    type: "subscription",
    interval: "month",
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
    stripePriceId: "price_PROD_ENTERPRISE_MONTHLY_REPLACE_ME",
    stripeProductId: "prod_PROD_ENTERPRISE_REPLACE_ME",
    price: 9999,
    currency: "usd",
    type: "subscription",
    interval: "month",
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
  
  // One-time Products - Replace with real production IDs
  {
    id: "template-pack",
    name: "Premium Template Pack",
    description: "50 premium templates for your projects",
    stripePriceId: "price_PROD_TEMPLATE_PACK_REPLACE_ME",
    stripeProductId: "prod_PROD_TEMPLATE_PACK_REPLACE_ME",
    price: 4999,
    currency: "usd",
    type: "one_time",
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
    stripePriceId: "price_PROD_PRIORITY_SUPPORT_REPLACE_ME",
    stripeProductId: "prod_PROD_PRIORITY_SUPPORT_REPLACE_ME",
    price: 1999,
    currency: "usd",
    type: "one_time",
    features: [
      "Priority email support",
      "Live chat support",
      "1-month duration",
      "Expert assistance"
    ],
  },
];

/**
 * Get the appropriate product configuration based on the environment
 * Uses process.env.NODE_ENV to determine if we're in test or production mode
 */
export function getStripeProducts(): ProductConfig[] {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? productionModeProducts : testModeProducts;
}

/**
 * Get subscription plans only
 */
export function getSubscriptionPlans(): ProductConfig[] {
  return getStripeProducts().filter(product => product.type === "subscription");
}

/**
 * Get one-time products only
 */
export function getOneTimeProducts(): ProductConfig[] {
  return getStripeProducts().filter(product => product.type === "one_time");
}

/**
 * Get a specific product by ID
 */
export function getProductById(id: string): ProductConfig | undefined {
  return getStripeProducts().find(product => product.id === id);
}

/**
 * Get a product by Stripe price ID
 */
export function getProductByPriceId(priceId: string): ProductConfig | undefined {
  return getStripeProducts().find(product => product.stripePriceId === priceId);
}