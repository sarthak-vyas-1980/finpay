import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="transition duration-200 hover:shadow-lg border c p-6 dark:border-slate-700 dark:text-gray-200 bg-white dark:bg-slate-800 rounded-xl bg-[#ededed] dark:bg-slate-700">
      <h1 className="text-xl font-bold border-b dark:border-b-slate-600 pb-2">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}
