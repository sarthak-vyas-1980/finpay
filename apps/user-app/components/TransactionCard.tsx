import { UPArrow, DOWNArrow } from "@repo/ui/icons";

export const TransactionCard = ({status, provider, upOrDown, amount, label, date, toFrom}:{
    upOrDown: string,
    amount: number,
    label: string,
    date: Date,
    toFrom?: string,
    provider?: string,
    status?: string
}) => {
    return <div className="my-1">
        <div className="flex justify-between">
            <div className="flex">
                <div className={`mr-2 flex justify-center ${upOrDown==="+" ? "text-green-500" : "text-red-500" } items-center`}> {upOrDown==="+" ? <UPArrow /> : <DOWNArrow />} </div>
                <div>
                    <div>{label}</div>
                    <div>{toFrom}</div>
                    <div>{provider}</div>
                    <div className="text-slate-600">{date.toLocaleString()}</div>
                </div>
            </div>
            <div className="flex justify-center items-center">
                <div>
                    <div className="flex justify-end">{upOrDown} ₹{amount/100}</div>
                    <div className="text-slate-600 text-sm">{status}</div>
                </div>
            </div>
        </div><hr></hr>
    </div>
}