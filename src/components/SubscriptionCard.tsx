import { useAction, useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";

interface Subscription {
  _id: string;
  status: string;
  planName: string;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
}

interface SubscriptionCardProps {
  subscription: Subscription | null;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const cancelSubscription = useMutation(api.subscriptions.cancelSubscription);
  const createPortalSession = useAction(api.payments.createPortalSession);

  const handleCancel = async () => {
    try {
      await cancelSubscription();
      toast.success(
        "Subscription will be canceled at the end of the billing period"
      );
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await createPortalSession();
      window.open(url, "_blank");
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  if (!subscription) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <p className="text-muted-foreground mb-4">
          You don't have an active subscription yet.
        </p>
        <p className="text-sm text-gray-500">
          Choose a plan below to get started with premium features.
        </p>
      </div>
    );
  }

  const isActive = subscription.status === "active";
  const endDate = new Date(subscription.currentPeriodEnd).toLocaleDateString();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Subscription</h2>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {subscription.status}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Plan</p>
          <p className="font-medium">{subscription.planName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            {subscription.cancelAtPeriodEnd ? "Ends on" : "Renews on"}
          </p>
          <p className="font-medium">{endDate}</p>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Your subscription will be canceled at the end of the current
              billing period.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <Button
          onClick={() => void handleManageBilling()}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Manage Billing
        </Button>

        {isActive && !subscription.cancelAtPeriodEnd && (
          <button
            onClick={() => void handleCancel()}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
