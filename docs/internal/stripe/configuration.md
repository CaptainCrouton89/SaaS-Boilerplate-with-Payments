# Stripe Configuration Guide

This document provides comprehensive instructions for configuring Stripe products and prices for both test and production environments in the SaaS Boilerplate.

## Overview

The application uses a centralized configuration system in `stripe.config.ts` that automatically switches between test and production Stripe products based on the `NODE_ENV` environment variable.

## Prerequisites

- Stripe CLI installed and configured
- Stripe account with appropriate permissions
- Project environment set up with Convex

## Test Environment Setup

### 1. Login to Stripe CLI

First, ensure you're logged into the correct Stripe account for testing:

```bash
# Login to Stripe CLI (will open browser for authentication)
stripe login

# Verify you're logged into the correct account
stripe config --list
```

### 2. Create Test Products

Create subscription products:

```bash
# Basic Plan
stripe products create --name "Basic Plan" --description "Perfect for getting started"

# Pro Plan  
stripe products create --name "Pro Plan" --description "For growing businesses"

# Enterprise Plan
stripe products create --name "Enterprise Plan" --description "Full-featured plan for large teams"
```

Create one-time purchase products:

```bash
# Premium Template Pack
stripe products create --name "Premium Template Pack" --description "50 premium templates for your projects"

# Priority Support
stripe products create --name "Priority Support" --description "1-month priority email and chat support"
```

### 3. Create Test Prices

**Important**: Copy the product IDs from the previous step and use them in the following commands.

Create subscription prices:

```bash
# Basic Plan - $9.99/month (replace prod_XXX with actual product ID)
stripe prices create --product prod_XXX --unit-amount 999 --currency usd --recurring.interval month

# Pro Plan - $29.99/month (replace prod_XXX with actual product ID)
stripe prices create --product prod_XXX --unit-amount 2999 --currency usd --recurring.interval month

# Enterprise Plan - $99.99/month (replace prod_XXX with actual product ID)
stripe prices create --product prod_XXX --unit-amount 9999 --currency usd --recurring.interval month
```

Create one-time prices:

```bash
# Premium Template Pack - $49.99 (replace prod_XXX with actual product ID)
stripe prices create --product prod_XXX --unit-amount 4999 --currency usd

# Priority Support - $19.99 (replace prod_XXX with actual product ID)  
stripe prices create --product prod_XXX --unit-amount 1999 --currency usd
```

### 4. Update Test Configuration

Update the `testModeProducts` array in `stripe.config.ts` with your newly created product and price IDs:

```typescript
const testModeProducts: ProductConfig[] = [
  {
    id: "basic-monthly",
    name: "Basic Plan",
    description: "Perfect for getting started",
    stripePriceId: "price_YOUR_BASIC_PRICE_ID", // Replace with actual price ID
    stripeProductId: "prod_YOUR_BASIC_PRODUCT_ID", // Replace with actual product ID
    price: 999,
    currency: "usd",
    type: "subscription",
    interval: "month",
    // ... rest of configuration
  },
  // ... other products
];
```

## Production Environment Setup

### 1. Switch to Production Mode

```bash
# Login to your production Stripe account if different
stripe login

# Or switch to live mode for existing account
# Note: Use --live flag for production operations
```

### 2. Create Production Products

Use the same commands as test mode but with the `--live` flag:

```bash
# Create products in live mode
stripe products create --name "Basic Plan" --description "Perfect for getting started" --live
stripe products create --name "Pro Plan" --description "For growing businesses" --live
stripe products create --name "Enterprise Plan" --description "Full-featured plan for large teams" --live
stripe products create --name "Premium Template Pack" --description "50 premium templates for your projects" --live
stripe products create --name "Priority Support" --description "1-month priority email and chat support" --live
```

### 3. Create Production Prices

```bash
# Create subscription prices in live mode
stripe prices create --product prod_XXX --unit-amount 999 --currency usd --recurring.interval month --live
stripe prices create --product prod_XXX --unit-amount 2999 --currency usd --recurring.interval month --live
stripe prices create --product prod_XXX --unit-amount 9999 --currency usd --recurring.interval month --live

# Create one-time prices in live mode
stripe prices create --product prod_XXX --unit-amount 4999 --currency usd --live
stripe prices create --product prod_XXX --unit-amount 1999 --currency usd --live
```

### 4. Update Production Configuration

Replace the placeholder IDs in the `productionModeProducts` array in `stripe.config.ts`:

```typescript
const productionModeProducts: ProductConfig[] = [
  {
    id: "basic-monthly",
    name: "Basic Plan",
    description: "Perfect for getting started",
    stripePriceId: "price_LIVE_BASIC_PRICE_ID", // Replace with live price ID
    stripeProductId: "prod_LIVE_BASIC_PRODUCT_ID", // Replace with live product ID
    price: 999,
    currency: "usd",
    type: "subscription",
    interval: "month",
    // ... rest of configuration
  },
  // ... other products
];
```

## Configuration Structure

### Product Configuration Interface

```typescript
interface ProductConfig {
  id: string;                    // Internal identifier
  name: string;                  // Display name
  description: string;           // Product description
  stripePriceId: string;        // Stripe price ID (price_xxx)
  stripeProductId: string;      // Stripe product ID (prod_xxx)
  price: number;                // Price in cents
  currency: string;             // Currency code (e.g., "usd")
  type: "subscription" | "one_time"; // Product type
  interval?: "month" | "year";  // For subscriptions only
  features: string[];           // Feature list for UI
  popular?: boolean;            // Mark as popular plan
}
```

### Environment Detection

The system automatically detects the environment using `process.env.NODE_ENV`:

- **Development/Test**: Uses `testModeProducts` array
- **Production**: Uses `productionModeProducts` array

### Helper Functions

The configuration provides several helper functions:

```typescript
// Get all products for current environment
getStripeProducts(): ProductConfig[]

// Get only subscription plans
getSubscriptionPlans(): ProductConfig[]

// Get only one-time products  
getOneTimeProducts(): ProductConfig[]

// Find product by internal ID
getProductById(id: string): ProductConfig | undefined

// Find product by Stripe price ID
getProductByPriceId(priceId: string): ProductConfig | undefined
```

## Usage in Convex Functions

The configuration is imported and used in `convex/products.ts`:

```typescript
import { 
  getStripeProducts, 
  getSubscriptionPlans as getConfigSubscriptionPlans, 
  getOneTimeProducts as getConfigOneTimeProducts 
} from "../stripe.config";

export const getSubscriptionPlans = query({
  args: {},
  handler: async (ctx) => {
    return getConfigSubscriptionPlans();
  },
});
```

## Verification

### 1. Test Development Environment

```bash
# Start development server
pnpm dev

# Visit http://localhost:5175 and verify products display correctly
```

### 2. Test Production Build

```bash
# Set production environment
export NODE_ENV=production

# Build application
pnpm run build

# Verify no compilation errors
pnpm run lint
```

## Troubleshooting

### Common Issues

1. **Wrong Account**: Verify you're logged into the correct Stripe account:
   ```bash
   stripe config --list
   ```

2. **Test vs Live Mode**: Ensure you're creating products in the correct mode (test by default, use `--live` for production).

3. **Price Creation Fails**: Make sure you're using the correct product ID from the previous step.

4. **Configuration Not Updated**: Verify that `stripe.config.ts` has been updated with the correct IDs.

### Debugging Commands

```bash
# List all products
stripe products list

# List all prices  
stripe prices list

# Get specific product details
stripe products retrieve prod_XXX

# Get specific price details
stripe prices retrieve price_XXX
```

## Security Notes

- Never commit live/production Stripe keys to version control
- Test mode keys are safe to include in configuration files
- Always use environment variables for sensitive Stripe configuration in production
- Regularly rotate API keys per Stripe security recommendations

## Current Test Configuration

The current test environment is configured with these products:

### Subscription Plans
- **Basic Plan**: $9.99/month (price_1Rvl5u9s881ETZA7iVC1tLBm)
- **Pro Plan**: $29.99/month (price_1Rvl5v9s881ETZA7AmMgKS0U) - Popular
- **Enterprise Plan**: $99.99/month (price_1Rvl5v9s881ETZA76ipi2VhK)

### One-time Products  
- **Premium Template Pack**: $49.99 (price_1Rvl649s881ETZA7SvB8Mytj)
- **Priority Support**: $19.99 (price_1Rvl649s881ETZA72mhmnPhb)

## Additional Resources

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Stripe Products API](https://stripe.com/docs/api/products)  
- [Stripe Prices API](https://stripe.com/docs/api/prices)
- [Convex Documentation](https://docs.convex.dev/)