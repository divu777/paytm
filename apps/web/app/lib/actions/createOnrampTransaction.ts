"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client"


export async function createOnRampTransaction(provider:string,amount:number) {
    const session=await getServerSession(authOptions);
    if(!session.user || !session.user.id){
        return{
            message:"Unauthorized user"
        }
    }
    const token=(Math.random()*1000).toString();
     await db.onRampTransaction.create({
        data:{
            provider,
            status:'Pending',
            startTime:new Date(),
            token:token,
            userId:Number(session.user.id),
            amount:amount*100
        }
    })

}