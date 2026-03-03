"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  isDisabled?: boolean;
}

export const Button = ({ onClick, children, isDisabled }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={isDisabled} type="button" className="text-white bg-[#1F2937] hover:bg-[#374151] focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
      {children}
    </button>

  );
};
