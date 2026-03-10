import { Card } from "@repo/ui/card";
import { getAllTransactions } from "../../lib/actions/getAllTransactions";
import TransactionHistory from "../../../components/TransactionHistory";

export default async function () {
    const transactions = await getAllTransactions();

    if(transactions.length === 0){
        return <div className="font-bold flex justify-center items-center h-[80vh] w-full">
            <div className="text-center">
                <div className=" text-3xl"> No Transactions yet! </div>
                <div> Add Money or Send to a friend </div>
            </div>
        </div>
    } 
    return <div className="mt-6 flex w-full justify-center items-center">
        <div className="w-[480px]">
            <Card title="History">
                <TransactionHistory transactions={transactions}/>
            </Card>
        </div>
    </div>
}