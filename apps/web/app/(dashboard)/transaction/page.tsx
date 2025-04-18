import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { P2Ptransaction } from "../../../components/p2pTransaction";


export type Transaction = {
    id: number;
    amount: number;
    timestamp: Date;
    fromUserId: number;
    toUserId: number;
  };
  


async function getP2PTransaction() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
           fromUserId : Number(session?.user?.id)
        },
        
        orderBy: {
          timestamp: 'desc', // Order by creation date, descending (most recent first)
        },
    });
    // return txns.map(t => ({
    //     time: t.timestamp,
    //     amount: t.amount,
    //     fromUser:t.fromUserId,
    //     toUser:t.toUserId
    // }))

    return txns.map((t: Transaction) => ({
        time: t.timestamp,
        amount: t.amount,
        fromUser: t.fromUserId,
        toUser: t.toUserId,
      }));
}

export default async function() {
    
    const transactions = await getP2PTransaction();

    return <div className="w-screen">
      
        <div className="grid grid-cols-1 gap-4  p-4">
            
           
                
                <div className="pt-4">
                    <P2Ptransaction transactions={transactions} />
                </div>
        
        </div>
    </div>
}