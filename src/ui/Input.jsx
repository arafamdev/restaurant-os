import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { type = "text", className = "", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      {...props}
      className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition outline-none placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-[#374151] dark:bg-[#1F2937] dark:text-[#F9FAFB] dark:placeholder:text-[#9CA3AF] dark:focus:border-emerald-800 dark:focus:ring-emerald-900 dark:disabled:bg-[#111827] dark:disabled:text-gray-500 ${className}`}
    />
  );
});

export default Input;
