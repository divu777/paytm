import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    const getStatusColor = (status: string): string => {
        switch (status.toLowerCase()) {
            case 'success':
                return 'text-green-500'; 
            case 'failure':
                return 'text-red-500'; 
            case 'pending':
                return 'text-yellow-500'; 
            default:
                return 'text-gray-500'; 
        }
    };
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="flex justify-between">
                <div className="pb-2">
                    <div className="text-sm ">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                    <div className={`text-xs ${getStatusColor(t.status)}`}>
                        {t.status}
                    </div>
                    
                </div>
                <div className="flex flex-col justify-center">
                     Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
    </Card>
}