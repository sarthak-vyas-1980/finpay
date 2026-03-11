import { Card } from "@repo/ui/card";

export const BalanceCard = ({
  amount,
  locked,
}: {
  amount: number;
  locked: number;
}) => {
  return (
    <div className="w-full">
      <Card title={"Balance"}>
        <div className="flex justify-between py-2 border-b border-slate-300 dark:border-slate-700 pb-2">
          <div> Unlocked balance </div>
          <div> {(amount - locked) / 100} INR </div>
        </div>
        <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 py-2">
          <div> Locked Balance </div>
          <div> {locked / 100} INR </div>
        </div>
        <div className="flex justify-between border-b border-slate-300 dark:border-slate-700 py-2">
          <div> Total Balance </div>
          <div> {amount / 100} INR </div>
        </div>
      </Card>
    </div>
  );
};
