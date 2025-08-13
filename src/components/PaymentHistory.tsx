interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  description: string;
  _creationTime: number;
}

interface PaymentHistoryProps {
  payments: Payment[];
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>
      
      {payments.length === 0 ? (
        <p className="text-secondary">No payments yet.</p>
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <p className="font-medium">{payment.description}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(payment._creationTime)} • {payment.type}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {formatAmount(payment.amount, payment.currency)}
                </p>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    payment.status === "succeeded"
                      ? "bg-green-100 text-green-800"
                      : payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
