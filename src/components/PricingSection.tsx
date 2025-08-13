import { useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

export function PricingSection() {
  const subscriptionPlans = useQuery(api.products.getSubscriptionPlans);
  const oneTimeProducts = useQuery(api.products.getOneTimeProducts);
  const createCheckoutSession = useAction(api.payments.createCheckoutSession);

  const handleSubscribe = async (priceId: string) => {
    try {
      const { url } = await createCheckoutSession({
        priceId,
        type: "subscription",
      });
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to create checkout session");
    }
  };

  const handlePurchase = async (priceId: string) => {
    try {
      const { url } = await createCheckoutSession({
        priceId,
        type: "one_time",
      });
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to create checkout session");
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(price / 100);
  };

  if (!subscriptionPlans && !oneTimeProducts) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Subscription Plans */}
      {subscriptionPlans && subscriptionPlans.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Choose Your Plan
            </h2>
            <p className="text-secondary">
              Start with a plan that works for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan._id}
                className={`bg-white rounded-lg shadow-sm border p-6 relative ${
                  plan.popular ? "border-primary ring-2 ring-primary/20" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-secondary text-sm mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-secondary">/{plan.interval}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.stripePriceId)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : "border border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One-time Products */}
      {oneTimeProducts && oneTimeProducts.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">
              One-time Purchases
            </h2>
            <p className="text-secondary">
              Get additional features with one-time payments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {oneTimeProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg shadow-sm border p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-secondary text-sm mb-3">{product.description}</p>
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(product.price, product.currency)}
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <svg
                        className="w-4 h-4 text-green-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePurchase(product.stripePriceId)}
                  className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Purchase Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
