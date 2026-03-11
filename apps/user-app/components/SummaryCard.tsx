export function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white border dark:border-slate-700 dark:text-gray-300 dark:bg-slate-800 shadow-md rounded-xl p-6 flex justify-between items-center transition duration-200 hover:shadow-lg">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-semibold mt-1">{value}</h2>
      </div>
      <div className="text-blue-500 text-xl">{icon}</div>
    </div>
  );
}
