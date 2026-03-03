"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Signup() {
  const [postInputs, setPostInputs] = useState({
    name: "",
    phone: "",
    password: "",
  });

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10 space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 text-center mt-2">
            Start your FinPay journey
          </p>
        </div>

        <InputBox
          label="Name"
          placeholder="Enter Name"
          onChange={(e) =>
            setPostInputs({ ...postInputs, name: e.target.value })
          }
        />

        <InputBox
          label="Phone"
          placeholder="Enter Phone"
          onChange={(e) =>
            setPostInputs({ ...postInputs, phone: e.target.value })
          }
        />

        <InputBox
          type="password"
          label="Password"
          placeholder="Enter Password"
          onChange={(e) =>
            setPostInputs({ ...postInputs, password: e.target.value })
          }
        />

        <button
          onClick={async () => {
            await signIn("credentials", {
              ...postInputs,
              mode: "signup",
              callbackUrl: "/dashboard",
            });
          }}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
        >
          Sign Up
        </button>

        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full py-3 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-all font-medium flex items-center justify-center gap-3"
        >
          <img src="/google.jpg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
type LabelledInput = {
  label: string;
  placeholder: string;
  onChange: (e: any) => void;
  type?: string;
};

function InputBox({
  label,
  placeholder,
  onChange,
  type = "text",
}: LabelledInput) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        required
      />
    </div>
  );
}
