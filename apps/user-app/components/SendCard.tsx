"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react";
import { p2PTransfer } from "../app/lib/actions/p2PTransfer";
import ConfirmTransfer from "./ConfirmTransfer";
import { useRouter } from "next/navigation";

export default function SendCard() {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    return <div className="h-[90vh]">
        <Center>
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput placeholder={"Number"} label="Number" onChange={(value) => {
                        setNumber(value)
                    }} />
                    <TextInput placeholder={"Amount"} label="Amount" onChange={(value) => {
                        setAmount(value)
                    }} />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={async () => {
                            if(!number || number.length !== 10){
                                alert("Enter valid phone number")
                                return;
                            }
                            if(Number(amount) <= 0){
                                alert("Enter valid amount")
                                return;
                            }
                            setShowConfirm(true);
                        }}> Send </Button>
                    </div>
                </div>
            </Card>
            {showConfirm && (
                <ConfirmTransfer to={number} amount={Number(amount)*100}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={async(upiPin)=>{
                        const res = await p2PTransfer(number, Number(amount)*100, upiPin)
                        if(res?.message !== "Transfer successful"){
                            return res;
                        }
                        setShowConfirm(false);
                        router.push("/transactions")
                    }} />
            )}
        </Center>
    </div>
}