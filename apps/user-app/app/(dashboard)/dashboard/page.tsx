import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

import { SummaryCard } from "../../../components/SummaryCard";
import SpendingChart from "../../../components/SpendingChart";
import { BalanceCard } from "../../../components/BalanceCard";

import { getAllTransactions } from "../../lib/actions/getAllTransactions";
import { getMonthlySpending } from "../../lib/metrics/getMonthlySpending";
import { getWeeklySpending } from "../../lib/metrics/getWeeklySpending";
import { getProfileCompletion } from "../../lib/metrics/getProfileCompletion";
import { lockBalance, unlockBalance } from "../../lib/actions/balanceActions";

import Link from "next/link";

async function getBalance(userId: number) {
  const balance = await prisma.balance.findFirst({
    where: { userId },
  });

  return {
    amount: balance?.amount ?? 0,
    locked: balance?.locked ?? 0,
  };
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return <div>Please login</div>;
  }
  const userId = Number(session.user.id);

  const [balance, transactions, monthlySpend, weeklyData, completion] =
    await Promise.all([
      getBalance(userId),
      getAllTransactions(),
      getMonthlySpending(userId),
      getWeeklySpending(userId),
      getProfileCompletion(userId),
    ]);

  return (
    <div className="mt-4 max-w-6xl mx-auto">
      {completion < 100 && (
        <div className="bg-yellow-50 dark:bg-yellow-900 border dark:border-slate-700 border-yellow-200 dark:border-yellow-600 p-4 rounded-lg flex justify-between">
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-200">
              {" "}
              Complete your profile{" "}
            </p>
            <p className="text-sm"> Your profile is {completion}% complete </p>
          </div>
          <Link
            href="/profile"
            className="flex items-center bg-yellow-500 text-white px-3 py-0 rounded-lg"
          >
            Complete
          </Link>
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-3">
        <SummaryCard
          title="Wallet Balance"
          value={`₹${balance.amount / 100}`}
        />
        <SummaryCard
          title="Monthly Spending"
          value={`₹${monthlySpend / 100}`}
        />
        <SummaryCard
          title="Transactions"
          value={transactions.length.toString()}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-5 items-center">
        <div className="col-span-2">
          <SpendingChart data={weeklyData} />
        </div>
        <div className="w-full max-w-sm">
          <BalanceCard amount={balance.amount} locked={balance.locked} />

          <div className="mt-5 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm p-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
              Lock / Unlock Balance
            </h3>
            <form
              action={async (formData) => {
                "use server";
                const amount = Number(formData.get("amount")) * 100;
                await lockBalance(amount);
              }}
              className="flex justify-between"
            >
              <input
                name="amount"
                placeholder="Amount"
                defaultValue={""}
                className="border dark:border-slate-700 px-2 py-1 rounded-md text-sm dark:bg-slate-900 dark:text-gray-200"
              />
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                Lock
              </button>
            </form>
            <form
              action={async (formData) => {
                "use server";
                const amount = Number(formData.get("amount")) * 100;
                await unlockBalance(amount);
              }}
              className="flex justify-between mt-3"
            >
              <input
                name="amount"
                placeholder="Amount"
                defaultValue={""}
                className="border dark:border-slate-700 px-2 py-1 rounded-md text-sm dark:bg-slate-900 dark:text-gray-200"
              />
              <button className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                Unlock
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-5 transition duration-200 hover:shadow-lg">
        {/* <div className="col-span-2"> */}
        <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            Quick Actions
          </h3>
          <div className="flex gap-6 flex-wrap justify-center">
            <Link
              href="/transfer"
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition"
            >
              + Add Money
            </Link>
            <Link
              href="/p2P"
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition"
            >
              ↗ Send Money
            </Link>
            <Link
              href="/transactions"
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-100 transition"
            >
              📄View Transactions
            </Link>
          </div>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}
