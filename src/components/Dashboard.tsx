import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SubscriptionCard } from "./SubscriptionCard";
import { PaymentHistory } from "./PaymentHistory";
import { PricingSection } from "./PricingSection";

export function Dashboard() {
  const user = useQuery(api.auth.loggedInUser);
  const subscription = useQuery(api.subscriptions.getUserSubscription);
  const payments = useQuery(api.payments.getUserPayments);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Welcome back, {user.name || user.email}!
        </h1>
        <p className="text-secondary">
          Manage your subscription and billing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SubscriptionCard subscription={subscription || null} />
          {!subscription && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Choose a Plan</h2>
              <PricingSection />
            </div>
          )}
        </div>
        
        <div>
          <PaymentHistory payments={payments || []} />
        </div>
      </div>
    </div>
  );
}
