function PageHeader({ icon: Icon, title, description, action }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 dark:border-[#374151] dark:bg-[#111827] dark:text-gray-200">
          {Icon && <Icon className="h-6 w-6" />}
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </header>
  );
}

export default PageHeader;
