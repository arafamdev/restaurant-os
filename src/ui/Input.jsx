import { forwardRef } from "react";

const Input = forwardRef(function Input({ type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      {...props}
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100"
    />
  );
});

export default Input;
