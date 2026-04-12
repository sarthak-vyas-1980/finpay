"use client";
import { useState } from "react";

export default function ConfirmTransfer({
  to,
  amount,
  onConfirm,
  onCancel,
}: {
  to: string;
  amount: number;
  onConfirm: (upiPin: string) => Promise<{ message?: string } | void> | void;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [upiPin, setUpiPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="ml-60">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-[420px] shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">Confirm Payment</h2>
              <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">
                Enter your UPI PIN to complete this transfer.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-gray-300">Paying</span>
              <span className="font-semibold">₹{(amount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-slate-600 dark:text-gray-300">To</span>
              <span className="font-medium">{to}</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-1">
              UPI PIN
            </label>
            <input
              inputMode="numeric"
              autoFocus
              value={upiPin}
              onChange={(e) => {
                setError(null);
                const next = e.target.value.replace(/\D/g, "").slice(0, 4);
                setUpiPin(next);
              }}
              placeholder="••••"
              className="w-full border dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 px-3 py-2 rounded-lg tracking-[0.35em]"
            />
            {error && (
              <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border dark:border-slate-700 text-slate-700 dark:text-gray-200"
              onClick={() => {
                if (loading) return;
                onCancel();
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg"
              disabled={loading || upiPin.length !== 4}
              onClick={async () => {
                setLoading(true);
                setError(null);
                try {
                  const res = await onConfirm(upiPin);
                  // If caller returns a message, treat it as an error (unless they handle navigation themselves)
                  if (res && typeof res === "object" && res.message && res.message !== "Transfer successful") {
                    setError(res.message);
                    setLoading(false);
                  }
                } catch (e: any) {
                  setError(e?.message || "Something went wrong");
                  setLoading(false);
                }
              }}
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
