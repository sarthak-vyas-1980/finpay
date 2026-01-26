import { Card } from "@repo/ui/card"
import { UPArrow } from "@repo/ui/icons"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?    (ans: enum maybe)
        status: string,
        provider: string
    }[] // Array of Objects
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => <div className="my-2 flex justify-between">
                <div className="flex">
                    <div className="mr-2 flex justify-center items-center">
                        <UPArrow/>
                    </div>
                    <div>
                        <div className="text-sm">
                            Received from
                        </div>
                        <div className="text-sm">
                            {t.provider}
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.time.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="text-sm flex justify-center items-center">
                <div>
                    <div>+ ₹{t.amount/100}</div>
                    <div>{t.status}</div>
                </div>
            </div>
        
            </div>)}
        </div>
    </Card>
}