import { Card } from "@repo/ui/card";
import { getAllTransactions } from "../../lib/actions/getAllTransactions";
import { TransactionCard } from "../../../components/TransactionCard";

export default async function () {
    const transactions = await getAllTransactions();
    return<div className="flex w-full justify-center items-center">
        <Card title="History">
            {transactions.map(txn => (
                <div key={txn.time.toISOString()}>
                    {txn.type === "ON_RAMP" ? (
                        <TransactionCard status={txn.status} provider={txn.provider} upOrDown={"+"} amount={txn.amount} label={"Received from"} date={txn.time}/>
                    ) : (
                    txn.direction === "SENT" ? 
                    <TransactionCard toFrom={txn.to.name || txn.to.number.toString()} upOrDown={"+"} amount={txn.amount} label={"Received from"} date={txn.time}/> : 
                    <TransactionCard toFrom={txn.from.name || txn.from.number.toString()} upOrDown={"-"} amount={txn.amount} label={"Paid to"} date={txn.time}/>
                )}
            </div>
            ))}
        </Card>
    </div>
}