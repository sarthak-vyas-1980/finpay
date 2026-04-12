"use client";

import { Transaction } from "../app/lib/actions/getAllTransactions";

function escapeCsvCell(value: unknown) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const mustQuote = /[",\n\r]/.test(str);
  const escaped = str.replace(/"/g, '""');
  return mustQuote ? `"${escaped}"` : escaped;
}

function buildTransactionsCsv(transactions: Transaction[]) {
  const header = [
    "type",
    "time",
    "amount_paise",
    "amount_inr",
    "direction",
    "status",
    "provider",
    "from_name",
    "from_phone",
    "to_name",
    "to_phone",
  ];

  const rows = transactions.map((txn) => {
    if (txn.type === "ON_RAMP") {
      return [
        txn.type,
        txn.time.toISOString(),
        txn.amount,
        (txn.amount / 100).toFixed(2),
        "",
        txn.status,
        txn.provider,
        "",
        "",
        "",
        "",
      ]
        .map(escapeCsvCell)
        .join(",");
    }

    return [
      txn.type,
      txn.time.toISOString(),
      txn.amount,
      (txn.amount / 100).toFixed(2),
      txn.direction,
      "",
      "",
      txn.from.name ?? "",
      txn.from.number ?? "",
      txn.to.name ?? "",
      txn.to.number ?? "",
    ]
      .map(escapeCsvCell)
      .join(",");
  });

  return [header.join(","), ...rows].join("\r\n");
}

export default function DownloadTransactionsCsvButton({
  transactions,
}: {
  transactions: Transaction[];
}) {
  function download() {
    const csv = buildTransactionsCsv(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `transactions_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
      type="button"
    >
      Download CSV
    </button>
  );
}
