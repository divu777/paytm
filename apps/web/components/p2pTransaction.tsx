import { Card } from "@repo/ui/card";


export const P2Ptransaction = ({
  transactions,
}: {
  transactions: {
    time: Date;
    amount: number;
    fromUser: number;
    toUser: number;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center text-gray-600 py-8">
          No Recent transactions
        </div>
      </Card>
    );
  }

  return (
    <Card title="Recent Transactions">
      <div className="space-y-4 pt-4">
        {transactions.map((t, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200 shadow-sm"
          >
            {/* Transaction Information */}
            <div className="flex flex-col space-y-1 w-3/5">
              <div className="text-sm text-gray-500">Received INR</div>
              <div className="text-xs text-gray-400">
                {t.time.toLocaleString("en-IN", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Transaction Amount */}
            <div className="flex items-center justify-center text-xl text-green-500 font-semibold">
              ₹{(t.amount / 100).toFixed(2)}
            </div>

            {/* Arrow for transaction flow */}
            <div className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
</svg>

              <div className="text-xs text-gray-500">
                {`User ${t.fromUser} → User ${t.toUser}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
