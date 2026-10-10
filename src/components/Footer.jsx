function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200/70 bg-white/70 px-4 py-5 transition-colors duration-200 sm:px-6 lg:px-8 dark:border-[#374151] dark:bg-[#111827]/50">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Designed &amp; Developed by{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              Arafam Mussa Silla
            </span>
          </p>

          <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
            Built with React and Supabase.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a
            href="https://github.com/arafamdev"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-gray-500 transition-colors hover:text-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none dark:text-gray-400 dark:hover:text-emerald-400"
          >
            GitHub
          </a>

          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600"
          />

          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {currentYear} RestaurantOS
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
