import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="transition duration-200 hover:shadow-lg border p-6 bg-white rounded-xl bg-[#ededed]">
      <h1 className="text-xl font-bold border-b pb-2">
        {title}
      </h1>
      <p>{children}</p>
    </div>
  );
}
