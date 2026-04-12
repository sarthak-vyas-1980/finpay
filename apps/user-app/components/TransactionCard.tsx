import { UPArrow, DOWNArrow } from "@repo/ui/icons";

function formatDateUtc(date: Date) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const pad2 = (n: number) => String(n).padStart(2, "0");
  const dd = pad2(date.getUTCDate());
  const mon = months[date.getUTCMonth()] ?? "";
  const yyyy = date.getUTCFullYear();
  const hh = pad2(date.getUTCHours());
  const mm = pad2(date.getUTCMinutes());
  return `${dd} ${mon} ${yyyy}, ${hh}:${mm} UTC`;
}

export const TransactionCard = ({
  status,
  provider,
  upOrDown,
  amount,
  label,
  date,
  toFrom,
}: {
  upOrDown: string;
  amount: number;
  label: string;
  date: Date;
  toFrom?: string;
  provider?: string;
  status?: string;
}) => {
  return (
    <div className="my-1">
      <div className="flex justify-between">
        <div className="flex">
          <div
            className={`mr-2 flex justify-center ${upOrDown === "+" ? "text-green-500" : "text-red-500"} items-center`}
          >
            {" "}
            {upOrDown === "+" ? <UPArrow /> : <DOWNArrow />}{" "}
          </div>
          <div>
            <div>{label}</div>
            <div>{toFrom}</div>
            <div>{provider}</div>
            <div className="text-slate-600 dark:text-gray-500">
              {formatDateUtc(date)}
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <div className="flex justify-end">
              {upOrDown} ₹{amount / 100}
            </div>
            <div className="text-slate-600 dark:text-gray-500 text-sm">
              {status}
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
    </div>
  );
};
