import { useEffect, useState } from "react";
import { Button } from "./button";
import Link from "next/link";

interface AppbarProps {
  user?: {
    name?: string | null;
    avatar?: string | null;
  };
  // TODO: can u figure out what the type should be here?
  onSignin: any;
  onSignout: any;
}

export const Appbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);
  function toggle() {
    if (dark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDark(!dark);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between border-b px-4 border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-400">
      <div className="font-bold py-2 text-[#111827] dark:text-black flex items-center">
        <div className="flex gap-2 items-center">
          <div className="text-3xl">💳</div>
          <div>
            <div className="leading-4 my-1">FinPay</div>
            <div className="text-xs font-light">Wallet App</div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center pt-1">
        <button onClick={toggle} aria-label="Toggle dark mode"
          className={` relative flex items-center w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none
            ${dark ? "bg-slate-800" : "bg-slate-300"}
          `}
        >
          {/* Sliding knob */}
          <span
            className={` flex items-center justify-center w-5 h-5 rounded-full shadow-md text-xs transition-all duration-300 ease-in-out
              ${dark ? "translate-x-7 bg-white text-blue-600" : "translate-x-0 bg-white text-yellow-500"}
            `}
          >
            {dark ? "🌙" : "☀️"}
          </span>
        </button>
        <Link href="/profile">
          <img
            src={user?.avatar || "/default_avatar.png"}
            className="mx-3 w-10 h-10 rounded-full"
          />
        </Link>
        <div className="mt-1 text-white bg-red-500 hover:bg-[#374151] focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
          <button onClick={user ? onSignout : onSignin}>
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};
