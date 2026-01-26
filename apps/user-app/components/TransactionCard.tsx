import { UPArrow, DOWNArrow } from "@repo/ui/icons";

export const TransactionCard = ({upOrDown, amount, label, date, toFrom}:{
    upOrDown: string,
    amount: number,
    label: string,
    date: Date,
    toFrom?: number
}) => {
    return <div>
        <div className="flex justify py-2 gap-40 between">
            <div className="flex">
                <div className="mr-2 flex justify-center items-center"> {upOrDown==="+" ? <UPArrow /> : <DOWNArrow />} </div>
                <div>
                    <div>{label}</div>
                    <div>{toFrom}</div>
                    <div className="text-slate-600">{date.toLocaleString()}</div>
                </div>
            </div>
            <div className="flex justify-center items-center">
                {upOrDown} ₹{amount/100}
            </div>
        </div><hr></hr>
    </div>
}