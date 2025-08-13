import { httpRouter } from "convex/server";
import type Stripe from "stripe";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// Test endpoint
http.route({
  path: "/test",
  method: "GET",
  handler: httpAction(async () => {
    return new Response("Test endpoint working!", { status: 200 });
  }),
});

// Stripe webhook handler
http.route({
  path: "/stripe/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe signature", { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-07-30.basil",
      });

      // Verify webhook signature
      const event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret
      );

      console.log(`Processing webhook event: ${event.type}`);

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("Checkout session completed:", session.id);

          if (session.mode === "subscription" && session.subscription) {
            // Handle subscription checkout completion
            const stripeSubscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            );
            const customer = await stripe.customers.retrieve(
              stripeSubscription.customer as string
            );

            if (customer.deleted) {
              throw new Error("Customer was deleted");
            }

            const priceId = stripeSubscription.items.data[0]?.price.id;
            const userId = session.metadata?.userId;

            if (userId && priceId) {
              // Try to create the subscription
              try {
                await ctx.runMutation(
                  api.subscriptions.createSubscriptionFromWebhook,
                  {
                    userId: userId,
                    stripeCustomerId: customer.id,
                    stripeSubscriptionId: stripeSubscription.id,
                    status: stripeSubscription.status,
                    priceId: priceId,
                    planName:
                      stripeSubscription.items.data[0]?.price.nickname ||
                      "Unknown Plan",
                    currentPeriodStart:
                      stripeSubscription.items.data[0]?.current_period_start *
                        1000 || 0,
                    currentPeriodEnd:
                      stripeSubscription.items.data[0]?.current_period_end *
                        1000 || 0,
                  }
                );
                console.log(
                  "Subscription created successfully:",
                  stripeSubscription.id
                );
              } catch (error) {
                // If creation fails (subscription might already exist), try to update
                console.log(
                  "Subscription creation failed, trying update:",
                  error
                );
                await ctx.runMutation(
                  api.subscriptions.updateSubscriptionFromWebhook,
                  {
                    stripeSubscriptionId: stripeSubscription.id,
                    status: stripeSubscription.status,
                    currentPeriodStart:
                      stripeSubscription.items.data[0]?.current_period_start *
                        1000 || 0,
                    currentPeriodEnd:
                      stripeSubscription.items.data[0]?.current_period_end *
                        1000 || 0,
                    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
                  }
                );
              }
            }
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log("Processing subscription:", subscription.id);

          await ctx.runMutation(
            api.subscriptions.updateSubscriptionFromWebhook,
            {
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              currentPeriodStart:
                subscription.items.data[0]?.current_period_start * 1000 || 0,
              currentPeriodEnd:
                subscription.items.data[0]?.current_period_end * 1000 || 0,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            }
          );
          break;
        }

        case "payment_intent.succeeded": {
          const paymentIntent = event.data.object;
          console.log("Payment intent succeeded:", paymentIntent.id);

          await ctx.runMutation(api.payments.createPayment, {
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            status: "succeeded",
            type:
              (paymentIntent.metadata?.type as "subscription" | "one_time") ||
              "one_time",
            description: paymentIntent.description || "Payment",
          });
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          console.log("Subscription deleted:", subscription.id);

          await ctx.runMutation(
            api.subscriptions.updateSubscriptionFromWebhook,
            {
              stripeSubscriptionId: subscription.id,
              status: "canceled",
              currentPeriodStart:
                subscription.items.data[0]?.current_period_start * 1000 || 0,
              currentPeriodEnd:
                subscription.items.data[0]?.current_period_end * 1000 || 0,
              cancelAtPeriodEnd: true,
            }
          );
          break;
        }

        case "invoice.created":
        case "invoice.finalized":
        case "invoice.paid":
        case "invoice.payment_succeeded": {
          const invoice = event.data.object;
          console.log(`Invoice ${event.type}:`, invoice.id);

          // These events are informational for now
          // We mainly handle subscription updates via subscription events
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response(
        `Webhook error: ${error instanceof Error ? error.message : "Unknown error"}`,
        { status: 400 }
      );
    }
  }),
});

export default http;
