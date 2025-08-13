import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

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

    try {
      // In a real implementation, you would verify the webhook signature
      // and parse the event data from Stripe
      const event = JSON.parse(body);

      switch (event.type) {
        case "customer.subscription.created":
        case "customer.subscription.updated":
          await ctx.runMutation(api.subscriptions.updateSubscription, {
            stripeSubscriptionId: event.data.object.id,
            status: event.data.object.status,
            currentPeriodStart: event.data.object.current_period_start * 1000,
            currentPeriodEnd: event.data.object.current_period_end * 1000,
            cancelAtPeriodEnd: event.data.object.cancel_at_period_end,
          });
          break;

        case "payment_intent.succeeded":
          await ctx.runMutation(api.payments.createPayment, {
            stripePaymentIntentId: event.data.object.id,
            amount: event.data.object.amount,
            currency: event.data.object.currency,
            status: "succeeded",
            type: event.data.object.metadata?.type || "one_time",
            description: event.data.object.description || "Payment",
          });
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response("OK", { status: 200 });
    } catch (error) {
      console.error("Webhook error:", error);
      return new Response("Webhook error", { status: 400 });
    }
  }),
});

export default http;
