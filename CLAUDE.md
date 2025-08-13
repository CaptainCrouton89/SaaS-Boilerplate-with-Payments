# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development

- `npm run dev`: Start all development servers (frontend, Convex backend, and Stripe webhook listener)
- `npm run dev:frontend`: Start Vite frontend only (opens browser automatically)
- `npm run dev:backend`: Start Convex backend only
- `npm run dev:stripe`: Start Stripe CLI webhook listener (forwards to acoustic-mule-30.convex.site)

### Build and Quality

- `npm run build`: Build frontend for production
- `npm run lint`: Run complete linting pipeline (TypeScript checks for convex + frontend, Convex validation, Vite build)

Note: The lint command is comprehensive and includes TypeScript compilation checks, Convex schema validation, and production build verification. Always run this before committing changes.

## Architecture Overview

### Backend (Convex)

- **Database Schema** (`convex/schema.ts`): Uses Convex's type-safe schema with tables for users (via auth), subscriptions, payments, and products
- **Authentication** (`convex/auth.ts`, `convex/auth.config.ts`): Convex Auth with anonymous authentication enabled
- **HTTP Routes** (`convex/router.ts`): Custom HTTP endpoints including Stripe webhook handler at `/stripe/webhook`
- **Payment Processing** (`convex/payments.ts`, `convex/subscriptions.ts`): Stripe integration for subscription and payment management
- **Products** (`convex/products.ts`): Product catalog management with Stripe price/product sync

### Frontend (React + Vite)

- **Routing Structure**: Dual layout system with marketing routes (unauthenticated) and app routes (authenticated)
  - Marketing Layout: Landing, About, Contact, Pricing, Login, Signup pages
  - Authenticated Layout: Dashboard, Profile pages with navigation
- **State Management**: Uses Convex React hooks for real-time data synchronization
- **UI Components**: Radix UI primitives with Tailwind CSS styling in `src/components/ui/`
- **Authentication Flow**: Automatic route protection and redirects based on auth state

### Key Integrations

- **Stripe**: Full webhook handling for subscription lifecycle, payment processing, and product management
- **Convex Deployment**: Connected to `acoustic-mule-30` deployment
- **Tailwind CSS**: v4 with Vite plugin integration for styling

### Project Structure Patterns

- `convex/`: All backend logic, mutations, queries, and HTTP actions
- `src/pages/`: Page components organized by functionality
- `src/layouts/`: Layout wrappers for different app sections
- `src/components/`: Reusable UI components with shadcn/ui patterns
- `src/hooks/`: Custom React hooks (e.g., authentication error handling)

### Environment Variables Required

- `STRIPE_SECRET_KEY`: Stripe API secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook endpoint secret
- `CONVEX_SITE_URL`: Convex deployment URL (for auth configuration)

### Development Notes

- Uses TypeScript throughout with strict type checking
- Convex provides real-time data synchronization and type-safe APIs
- Stripe CLI integration for local webhook testing during development
- Authentication redirects prevent logged-in users from seeing marketing pages

### Docs

- Stripe CLI Reference `https://docs.stripe.com/cli/resources.md`
- Testing Convex `docs/internal/convex/http-actions-testing.md`
