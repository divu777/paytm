import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
enum OnRampStatus {
    Pending,
    Success,
    Failure
  }
  
type Transaction={
    id: number;
    token: string;
    amount: number;
    userId: number;
    status: OnRampStatus;
    provider: string;
    startTime: Date;
}

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findUnique({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        },
        take: 3, // Limit to 5 results
        orderBy: {
          startTime: 'desc', // Order by creation date, descending (most recent first)
        },
    });
    return txns.map((t:Transaction) => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <AddMoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}