"use client";

import { useState } from "react";
import { Transaction } from "../app/lib/actions/getAllTransactions";
import { TransactionCard } from "./TransactionCard";

type Filter = "ALL" | "SENT" | "RECEIVED" | "DEPOSITS";

export default function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const filteredTransactions = transactions
    .filter((txn) => {
      //Filter Logic
      if (
        filter === "SENT" &&
        ((txn.type === "P2P" && txn.direction !== "SENT") ||
          txn.type === "ON_RAMP")
      ) {
        return false;
      }
      if (
        filter === "RECEIVED" &&
        txn.type === "P2P" &&
        txn.direction !== "RECEIVED"
      ) {
        return false;
      }
      if (filter === "DEPOSITS" && txn.type !== "ON_RAMP") {
        return false;
      }
      return true;
    })
    .filter((txn) => {
      //Search Logic
      if (!search) return true;
      const q = search.trim().toLowerCase();

      if (txn.type === "P2P") {
        const fromName = txn.from.name?.toLowerCase() || "";
        const toName = txn.to.name?.toLowerCase() || "";
        const fromPhone = txn.from.number || "";
        const toPhone = txn.to.number || "";

        return (
          fromName.includes(q) ||
          toName.includes(q) ||
          fromPhone.includes(q) ||
          toPhone.includes(q) ||
          txn.amount.toString().includes(q)
        );
      }
      if (txn.type === "ON_RAMP") {
        return (
          txn.provider?.toLowerCase().includes(q) ||
          txn.status?.toLowerCase().includes(q) ||
          txn.amount.toString().includes(q)
        );
      }
      return true;
    });

  return (
    <div>
      <input
        placeholder="Search name, phone, bank, amount..."
        value={search}
        className="border dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 p-2 rounded w-full mb-4"
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS  */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {["ALL", "SENT", "RECEIVED", "DEPOSITS"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as Filter)}
              className={`px-3 py-1 rounded ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-slate-700 dark:text-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        {filteredTransactions.map((txn) => (
          <div key={txn.time.toISOString()}>
            {txn.type === "ON_RAMP" ? (
              <TransactionCard
                status={txn.status}
                provider={txn.provider}
                upOrDown={"+"}
                amount={txn.amount}
                label={"Received from"}
                date={txn.time}
              />
            ) : txn.direction === "SENT" ? (
              <TransactionCard
                toFrom={
                  txn.to.name ?? txn.to.number?.toString() ?? "Unknown User"
                }
                upOrDown={"-"}
                amount={txn.amount}
                label={"Paid to"}
                date={txn.time}
              />
            ) : (
              <TransactionCard
                toFrom={
                  txn.from.name || txn.from.number?.toString() || "Unknown User"
                }
                upOrDown={"+"}
                amount={txn.amount}
                label={"Received from"}
                date={txn.time}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
