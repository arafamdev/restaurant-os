
function EmptyState({ title, message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center dark:border-[#374151] dark:bg-[#111827]">
      <h3 className="text-base font-semibold text-gray-900 dark:text-[#F9FAFB]">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-[#9CA3AF]">
        {message}
      </p>
    </div>
  );
}

export default EmptyState;