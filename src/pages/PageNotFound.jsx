import { Link } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi2";

import BackButton from "../ui/BackButton";

function PageNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-12 dark:bg-[#0B1120]">
      <div className="w-full max-w-lg text-center">
        {/* Error illustration */}
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10" />

          <div className="absolute inset-3 rounded-full border border-emerald-200/70 dark:border-emerald-500/20" />

          <span className="relative text-4xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            404
          </span>
        </div>

        {/* Page heading */}
        <p className="text-xs font-semibold tracking-[0.25em] text-emerald-600 uppercase dark:text-emerald-400">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-600 sm:text-base dark:text-gray-400">
          The page you are looking for does not exist, may have been moved, or
          the address might be incorrect.
        </p>

        {/* Navigation actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:w-auto dark:bg-emerald-500 dark:text-gray-950 dark:hover:bg-emerald-400"
          >
            <HiOutlineHome size={19} />
            Back to Dashboard
          </Link>

          <div className="flex min-h-11 w-full items-center justify-center sm:w-auto">
            <BackButton />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-200 pt-5 dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            RestaurantOS
            <span className="mx-2 text-gray-300 dark:text-gray-700">•</span>
            Restaurant Management System
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
