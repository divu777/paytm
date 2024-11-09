"use server"
import db from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function sendMoney(toSend:number,amount:number){
    if(!toSend && toSend.toString().length!==10 || !amount && amount>=0){
        return{
            message:"error in inputs "
        }
    }
    try{
        const session=await getServerSession(authOptions);
        const from=session.user.id;
        if(!from){
            return{
                message:"error while sending no id "
            }
        }
        const toUser=await db.user.findFirst({
            where:{
                number:toSend.toString()
            }
        });
        if(!toUser){
            return{
                message:"user to send money not found"
            }
        }
        await db.$transaction(async(tx)=>{
            // this line blocks and locks the amount so no 2 req comes and deduct the balance to be negative 
            await tx.$queryRaw `SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
            const frombalance=await tx.balance.findUnique({
                where:{
                    userId:Number(from)
                }
            });
            if(!frombalance || frombalance.amount<amount){

                throw new Error("insufficient balance ")
            }
            await tx.balance.update({
                where:{
                    userId:Number(from)
                },
                data:{
                    amount:{
                        decrement:amount*100
                    }
                }
            });
            await tx.balance.update({
                where:{
                    userId:Number(toUser.id)
                },
                data:{
                    amount:{
                        increment:amount*100
                    }
                }
            })
            await tx.p2pTransfer.create({
                data:{
                    amount:amount*100,
                    timestamp: new Date(),
                    fromUserId:Number(from),
                    toUserId:toUser.id
                }
            })
        })
    }catch(err){
        console.log(err);
        return{
            message:"error in processing p2p"
        }
    }

}