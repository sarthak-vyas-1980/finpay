export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { Card } from "@repo/ui/card";
import { getAllTransactions } from "../../lib/actions/getAllTransactions";
import TransactionHistory from "../../../components/TransactionHistory";
import DownloadTransactionsCsvButton from "../../../components/DownloadTransactionsCsvButton";

export default async function () {
  const transactions = await getAllTransactions();

  if (transactions.length === 0) {
    return (
      <div className="font-bold flex justify-center items-center h-[80vh] w-full">
        <div className="text-center">
          <div className=" text-3xl"> No Transactions yet! </div>
          <div> Add Money or Send to a friend </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 flex w-full justify-center items-center">
      <div className="w-[480px]">
        <Card
          title="History"
          titleClassName="text-2xl"
          action={<DownloadTransactionsCsvButton transactions={transactions} />}
        >
          <TransactionHistory transactions={transactions} />
        </Card>
      </div>
    </div>
  );
}
