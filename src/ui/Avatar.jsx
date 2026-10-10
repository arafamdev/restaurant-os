function Avatar({ initials, sizeClass = "h-11 w-11", textClass = "text-sm" }) {
  return (
    <div
      className={`group/avatar flex ${sizeClass} shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-gray-100 ${textClass} font-semibold tracking-tight text-gray-800 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default Avatar;
