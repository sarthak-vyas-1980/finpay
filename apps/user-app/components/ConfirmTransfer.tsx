"use client";
import { useState } from "react";

export default function ConfirmTransfer({
  to,
  amount,
  onConfirm,
}: {
  to: string;
  amount: number;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="ml-60">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-96 shadow-lg">
          <h2 className="text-lg font-semibold mb-3"> Confirm Transfer </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Send
            <span className="font-semibold"> ₹{amount / 100} </span> to
            <span className="font-semibold"> {to} </span> ?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-3 py-1 rounded-md border dark:border-slate-700"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-md"
              onClick={async () => {
                setLoading(true);
                await onConfirm();
              }}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
