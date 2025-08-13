# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Starts both frontend (Vite) and backend (Convex) development servers in parallel
- `pnpm run dev:frontend` - Starts only the Vite frontend development server with auto-open
- `pnpm run dev:backend` - Starts only the Convex backend development server
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