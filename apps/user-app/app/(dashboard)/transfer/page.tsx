export const dynamic = "force-dynamic";

import prisma from "@repo/db";
import { AddMoney } from "../../../components/AddMoneyCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getCurrentUser } from "../../lib/authUser";

async function getOnRampTransactions() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }
  const txns = await prisma.onRampTransaction.findMany({
    where: {
      userId: Number(user?.id),
    },
    orderBy: {
      startTime: "desc",
    },
    take: 5,
  });
  return txns.map((t) => ({
    time: t.startTime,
    amount: t.amount,
    status: t.status,
    provider: t.provider,
  }));
}

export default async function () {
  const transactions = await getOnRampTransactions();

  return (
    <div className="w-full">
      <div className="text-4xl text-[#20438e] dark:text-blue-400 pt-8 mb-8 font-bold">
        Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <AddMoney />
        </div>
        <div>
          <div className="px-6">
            <OnRampTransactions transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
