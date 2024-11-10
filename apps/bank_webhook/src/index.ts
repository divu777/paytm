import express from "express";
import db from "@repo/db/client"

const app=express();
app.use(express.json());  
console.log("hello")

app.get("",(req,res)=>{
    res.json("you did ti ")
})

app.post("/hdfcWebhook",async(req,res)=>{
    const paymentInformation={
        token:req.body.token,
        userId:req.body.user_identifier,
        amount:req.body.amount 
    }; 
    console.log(paymentInformation) 
  try{
    await db.$transaction([
        db.balance.update({
            where:{
                userId:Number(paymentInformation.userId)
            },
            data:{
                amount:{
                    increment:Number(paymentInformation.amount)
                }
            }
        }),
        db.onRampTransaction.update({
            where:{
                token:paymentInformation.token
            },
            data:{
                status:"Success"
            }
        })
    ]);
    res.status(200).json({
        message:"captured "
    })

  }catch(err){
    console.log(err);
    await db.onRampTransaction.update({
        where:{
            token:paymentInformation.token
        },
        data:{
            status:"Failure"
        }
    })
    res.status(401).json({
        message:"error occured"
    })

  }

    

})


app.listen(3001)
