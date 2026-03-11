"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";

export default function SpendingChart({data} : {data:any[]}){
  return (
    <div className="bg-white border dark:border-slate-700 dark:text-gray-200 dark:bg-slate-800 rounded-xl shadow-md p-4 transition duration-200 hover:shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Weekly Spending</h2>
      <ResponsiveContainer width="100%" height={290}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}