# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Starts both frontend (Vite) and backend (Convex) development servers in parallel
- `pnpm run dev:frontend` - Starts only the Vite frontend development server with auto-open
- `pnpm run dev:backend` - Starts only the Convex backend development server
- `pnpm run dev:stripe` - Starts Stripe CLI webhook listener (forwards to .convex.site domain)
- `pnpm run build` - Builds the frontend application for production
- `pnpm run lint` - Runs comprehensive linting: TypeScript checks for convex/, TypeScript checks for frontend, Convex dev once, and production build

## Architecture Overview

This is a **SaaS Boilerplate with Payments** built using:

### Core Stack

- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS
- **Backend**: Convex (full-stack TypeScript platform)
- **Authentication**: Convex Auth with Password and Anonymous providers
- **Payments**: Stripe integration with subscriptions and one-time payments
- **UI**: Radix UI components with custom styling

### Project Structure

- **Frontend code**: `src/` directory (React components, utilities)
- **Backend code**: `convex/` directory (queries, mutations, actions, schema)
- **Generated types**: `convex/_generated/` (auto-generated API types)

### Key Backend Files

- `convex/schema.ts` - Database schema with auth tables and payment tables
- `convex/auth.ts` - Authentication configuration and user queries
- `convex/payments.ts` - Payment processing and Stripe integration
- `convex/subscriptions.ts` - Subscription management
- `convex/products.ts` - Product/pricing definitions
- `convex/http.ts` - HTTP routes and webhooks
- `convex/router.ts` - User-defined HTTP routes (separate from auth routes)

### Key Frontend Components

- `src/App.tsx` - Main application with authenticated/unauthenticated states
- `src/components/Dashboard.tsx` - User dashboard with subscription management
- `src/components/PricingSection.tsx` - Pricing display and purchase flows
- `src/components/SubscriptionCard.tsx` - Current subscription status
- `src/components/PaymentHistory.tsx` - Payment history display

### Database Schema

The application uses Convex's schema system with these main tables:

- **Auth tables** (from @convex-dev/auth): users, sessions, accounts, etc.
- **subscriptions**: User subscription data with Stripe integration
- **payments**: Payment history and transaction records
- **products**: Available products/plans with Stripe price IDs

### Authentication Flow

- Uses Convex Auth with Password and Anonymous providers
- Authentication state managed through Convex queries
- User sessions persist across browser refreshes
- Supports both email/password and anonymous sign-in

### Payment Integration

- Stripe Checkout for subscription and one-time payments
- Stripe Customer Portal for subscription management
- Webhook handling for payment status updates
- Support for multiple subscription tiers and one-time purchases

### Stripe Webhook Setup

**CRITICAL**: Convex has two different domains for different purposes:

- `.convex.cloud` - For query/mutation API calls via `/api/query`
- `.convex.site` - For HTTP actions defined in `convex/http.ts` and `convex/router.ts`

#### Webhook Configuration

The Stripe webhook endpoint must use the `.convex.site` domain:

```bash
# Correct webhook URL format
https://YOUR-DEPLOYMENT-NAME.convex.site/stripe/webhook
```

#### Development Setup

1. **Start the Stripe CLI listener** (requires correct domain):
   ```bash
   pnpm run dev:stripe
   # This runs: stripe listen --forward-to https://acoustic-mule-30.convex.site/stripe/webhook
   ```

2. **Required Environment Variables**:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe CLI output
   STRIPE_SECRET_KEY=sk_test_... # From Stripe Dashboard
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # From Stripe Dashboard (frontend)
   ```

3. **Test the webhook endpoint**:
   ```bash
   curl -X GET https://YOUR-DEPLOYMENT-NAME.convex.site/test
   ```

#### Webhook Handler Implementation

The webhook handler in `convex/router.ts` includes:

- **Stripe Signature Verification**: Uses `stripe.webhooks.constructEvent()` with the webhook secret
- **Event Handling**: Processes `checkout.session.completed`, subscription events, and `payment_intent.succeeded`
- **Updated Stripe API**: Uses current API property access patterns:
  - `subscription.items.data[0].current_period_start` (new format)
  - `subscription.items.data[0].current_period_end` (new format)
- **Error Handling**: Comprehensive error catching and logging
- **Database Updates**: Automatically updates subscription and payment records

#### Common Issues and Troubleshooting

1. **Wrong Domain Error**: If webhooks fail, verify you're using `.convex.site` not `.convex.cloud`
2. **Signature Verification Failures**: Ensure `STRIPE_WEBHOOK_SECRET` matches the CLI output
3. **Event Not Found**: Check that the webhook endpoint is accessible via curl test
4. **Database Updates Failing**: Verify user authentication and proper error handling in webhook functions

#### Webhook Events Handled

- `checkout.session.completed` - Creates/updates subscription and payment records
- `customer.subscription.updated` - Updates subscription status and billing cycle
- `customer.subscription.deleted` - Handles subscription cancellations
- `payment_intent.succeeded` - Records successful one-time payments

### Development Patterns

- **Convex Functions**: Follow new function syntax with explicit args/returns validators
- **Type Safety**: Strict TypeScript with generated types from Convex schema
- **Real-time Updates**: Convex queries automatically re-run when data changes
- **Error Handling**: Throw errors early with descriptive messages
- **Authentication**: All protected operations check user authentication via `getAuthUserId()`

### Environment Variables

The application requires several environment variables for Stripe integration:

- `STRIPE_SECRET_KEY` - Stripe secret key for backend operations
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for frontend
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint secret from Stripe CLI (for development)
- `SITE_URL` - Base URL for redirect URLs
- `STRIPE_SUCCESS_URL` - Post-payment success URL
- `STRIPE_CANCEL_URL` - Payment cancellation URL
- `STRIPE_PORTAL_RETURN_URL` - Customer portal return URL

### Convex Guidelines

This project follows strict Convex development patterns as defined in `.cursor/rules/convex_rules.mdc`:

- Always use new function syntax with args/returns validators
- Use proper function references (`api.` and `internal.`)
- Define comprehensive database schemas with appropriate indexes
- Use proper validators (`v.string()`, `v.id()`, etc.) for all function arguments
- Follow authentication patterns with `getAuthUserId()`
- Implement proper error handling in all functions

### UI/UX Patterns

- Responsive design with mobile-first approach
- Loading states for async operations
- Toast notifications for user feedback
- Authenticated/unauthenticated content switching
- Dashboard-style layout for logged-in users
- Landing page with pricing for anonymous users

This boilerplate provides a complete foundation for building SaaS applications with user authentication, subscription billing, and payment processing.

### Docs

- Stripe CLI Reference `https://docs.stripe.com/cli/resources`
