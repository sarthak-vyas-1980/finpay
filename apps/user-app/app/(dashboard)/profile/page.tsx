"use client";
import { useEffect, useRef, useState } from "react";
import { ProfileField } from "../../../components/ProfileField";
import { Button } from "@repo/ui/button";

type updateType = {
  id: number;
  name: string;
  email: string | null;
  number: string | null;
  avatar?: string | null;
  hasPassword: boolean;
  hasUpiPin?: boolean;
  password?: string;
};

type Message = {
  type: "error" | "success";
  text: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<updateType | null>(null);
  const [originalUser, setOriginalUser] = useState<updateType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [profileMessage, setProfileMessage] = useState<Message | null>(null);
  const [upiPin, setUpiPin] = useState("");
  const [upiPinConfirm, setUpiPinConfirm] = useState("");
  const [upiPinSaving, setUpiPinSaving] = useState(false);
  const [upiMessage, setUpiMessage] = useState<Message | null>(null);
  const [upiPinMode, setUpiPinMode] = useState<"view" | "edit">("view");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/user/update")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setOriginalUser(data);
        setUpiPinMode(data?.hasUpiPin ? "view" : "edit");
      });
  }, []);

  async function saveUpiPin() {
    setUpiMessage(null);

    if (upiPin.length !== 4) {
      setUpiMessage({ type: "error", text: "UPI PIN must be 4 digits" });
      return;
    }
    if (upiPin !== upiPinConfirm) {
      setUpiMessage({
        type: "error",
        text: "UPI PIN and confirmation do not match",
      });
      return;
    }

    setUpiPinSaving(true);
    const res = await fetch("/api/user/upi-pin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: upiPin }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setUpiMessage({
        type: "error",
        text: data?.error || "Failed to set UPI PIN",
      });
      setUpiPinSaving(false);
      return;
    }

    setUpiMessage({ type: "success", text: "UPI PIN set successfully" });
    setUser((prev) => (prev ? { ...prev, hasUpiPin: true } : prev));
    setUpiPin("");
    setUpiPinConfirm("");
    setUpiPinMode("view");
    setUpiPinSaving(false);
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }
  function handleFileChange(e: any) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }
  async function upload() {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/api/user/avatar", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUser((prev) => (prev ? { ...prev, avatar: data.avatar } : prev));
    setOriginalUser((prev) => (prev ? { ...prev, avatar: data.avatar } : prev));
    setFile(null);
    setPreview(null);
  }
  const filledFields = [
    user?.name,
    user?.email,
    user?.number,
    user?.hasPassword,
  ].filter(Boolean).length;

  const completionPercentage = Math.round((filledFields / 4) * 100);
  const hasChanged =
    user?.name !== originalUser?.name ||
    user?.email !== originalUser?.email ||
    user?.number !== originalUser?.number ||
    user?.password;

  if (!user)
    //Loading
    return (
      <div className="flex justify-center items-center h-[80vh] p-10 max-w-2xl mx-auto">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-neutral-tertiary animate-spin fill-brand"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
    );

  return (
    <div className="mt-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="w-full bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-gray-200 shadow-xl rounded-2xl p-8 order-2 lg:order-1 lg:col-span-7">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Your Profile</h2>
            <button
              onClick={() => {
                setEdit(!edit);
                setProfileMessage(null);
              }}
              className="text-blue-600 ml-8"
            >
              {edit ? "Cancel" : "Edit"}
            </button>
          </div>
          <hr className="mb-6" />

          <div className="flex flex-col items-center gap-3 mb-6">
            <img
              src={preview || user.avatar || "/default_avatar.png"}
              onClick={handleAvatarClick}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-slate-600 cursor-pointer hover:scale-105 transition"
            />
            {edit && (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            )}
            {file && (
              <button
                onClick={upload}
                className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
              >
                Upload Avatar
              </button>
            )}
          </div>

          {!edit ? (
            <div className="text-center">
              <ProfileField
                label="Name"
                value={user.name}
                edit={edit}
                onChange={(val: any) => setUser({ ...user, name: val })}
              />
            </div>
          ) : (
            <ProfileField
              label="Name"
              value={user.name}
              edit={edit}
              onChange={(val: any) => setUser({ ...user, name: val })}
            />
          )}
          <div className="mt-3"></div>
          <ProfileField
            label="Email"
            value={user.email}
            edit={edit}
            onChange={(val: any) => setUser({ ...user, email: val })}
          />

          <ProfileField
            label="Phone"
            value={user.number}
            edit={edit}
            onChange={(val: any) => setUser({ ...user, number: val })}
          />

          {edit && (
            <ProfileField
              label="New Password"
              value=""
              edit={true}
              onChange={(val: any) => setUser({ ...user, password: val })}
            />
          )}

          {edit && (
            <div className="flex justify-center ">
              <Button
                isDisabled={!hasChanged}
                onClick={async () => {
                  setProfileMessage(null);
                  const res = await fetch("/api/user/update", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                  });

                  const data = await res.json();
                  if (!res.ok) {
                    setProfileMessage({
                      type: "error",
                      text: data.error || "Something went wrong",
                    });
                    return;
                  }
                  setProfileMessage({
                    type: "success",
                    text: "Profile updated successfully",
                  });
                  setEdit(false);
                  setUser(data);
                  setOriginalUser(data);
                }}
              >
                Save Changes
              </Button>
            </div>
          )}
          {edit && profileMessage?.type === "error" && (
            <div className="flex justify-center mt-4 text-red-500 text-sm font-medium">
              {profileMessage.text}
            </div>
          )}
          {!edit && profileMessage?.type === "success" && (
            <div className="flex justify-center mt-4 text-green-500 text-sm font-medium">
              {profileMessage.text}
            </div>
          )}
          {!edit && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Profile Completion</span>
                <span className="font-semibold text-blue-600">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-gray-200 shadow-xl rounded-2xl p-8 order-1 lg:order-2 lg:col-span-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold">Security</h2>
              <p className="text-sm text-slate-600 dark:text-gray-300 mt-1">
                Manage UPI PIN used for P2P transfers.
              </p>
            </div>
          </div>
          <hr className="mb-6" />

          <div className="rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">UPI PIN</h3>
                <p className="text-sm text-slate-600 dark:text-gray-300">
                  {user.hasUpiPin
                    ? "Your UPI PIN is set. You'll be asked for it before sending money."
                    : "Set a 4-digit PIN to secure P2P transfers."}
                </p>
              </div>

              {user.hasUpiPin && upiPinMode === "view" && (
                <button
                  type="button"
                  onClick={() => {
                    setUpiMessage(null);
                    setUpiPin("");
                    setUpiPinConfirm("");
                    setUpiPinMode("edit");
                  }}
                  className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Reset UPI PIN
                </button>
              )}

              {user.hasUpiPin && upiPinMode === "edit" && (
                <button
                  type="button"
                  onClick={() => {
                    setUpiMessage(null);
                    setUpiPin("");
                    setUpiPinConfirm("");
                    setUpiPinMode("view");
                  }}
                  className="shrink-0 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-200 px-3 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              )}
            </div>

            {(!user.hasUpiPin || upiPinMode === "edit") && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New PIN
                  </label>
                  <input
                    inputMode="numeric"
                    value={upiPin}
                    onChange={(e) => {
                      setUpiMessage(null);
                      const next = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);
                      setUpiPin(next);
                    }}
                    placeholder="••••"
                    className="w-full border dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 px-3 py-2 rounded-lg tracking-[0.35em]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Confirm PIN
                  </label>
                  <input
                    inputMode="numeric"
                    value={upiPinConfirm}
                    onChange={(e) => {
                      setUpiMessage(null);
                      const next = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);
                      setUpiPinConfirm(next);
                    }}
                    placeholder="••••"
                    className="w-full border dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 px-3 py-2 rounded-lg tracking-[0.35em]"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={saveUpiPin}
                    disabled={
                      upiPinSaving ||
                      upiPin.length !== 4 ||
                      upiPinConfirm.length !== 4
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    {upiPinSaving ? "Saving..." : "Set UPI PIN"}
                  </button>
                </div>

                {upiMessage && (
                  <div
                    className={`sm:col-span-2 text-sm ${
                      upiMessage.type === "error"
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {upiMessage.text}
                  </div>
                )}
              </div>
            )}

            {user.hasUpiPin && upiMessage?.type === "success" && (
              <div className="mt-3 text-sm text-green-600 dark:text-green-400">
                {upiMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
