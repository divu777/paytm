"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/text-input";
import { useState } from "react";
import { sendMoney } from "../../lib/actions/p2p";

export default function peer(){
    const [amount,setAmount]=useState(0);
    const [number ,setNumber]=useState(0);
    return <div className=" flex items-center justify-center w-full ">
        <div className="">
        <Card title="Send Payment" >
          <div className="p-6 space-y-6">
           
            <div>
              <TextInput
                placeholder="Enter phone number"
                label="Phone Number"
               
                onChange={(value) => setNumber(value as unknown as number)}
               
              />
            </div>

            <div>
              <TextInput
                placeholder="Enter amount"
                label="Amount"
            
                onChange={(value) => setAmount(Number(value))}

              />
            </div>

            {/* Send Button */}
            <Button
              onClick={async() => {
                await sendMoney(number,amount)
              }}

            >
              Send
            </Button>
          </div>
        </Card>
    </div>
    </div>
}