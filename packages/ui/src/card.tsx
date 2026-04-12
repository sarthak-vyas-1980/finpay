import React from "react";

export function Card({
  title,
  action,
  titleClassName,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  titleClassName?: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="transition duration-200 hover:shadow-lg border c p-6 dark:border-slate-700 dark:text-gray-200 bg-white dark:bg-slate-800 rounded-xl bg-[#ededed] dark:bg-slate-700">
      <div className="flex items-center justify-between border-b dark:border-b-slate-600 pb-2">
        <h1 className={`${titleClassName ?? "text-xl"} font-bold`}>{title}</h1>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div>{children}</div>
    </div>
  );
}
