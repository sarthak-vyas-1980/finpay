"use client";

export const TextInput = ({
  placeholder,
  onChange,
  label,
}: {
  placeholder: string;
  onChange: (value: string) => void;
  label: string;
}) => {
  return (
    <div className="pt-2">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </label>
      <input type="text" id="first_name" onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
  );
};
