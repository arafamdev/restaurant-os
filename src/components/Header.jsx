import { useLocation } from "react-router-dom";

import { HiOutlineBell, HiOutlineMoon, HiOutlineBars3 } from "react-icons/hi2";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/reservations": "Reservations",
  "/tables": "Tables",
  "/customers": "Customers",
  "/menu": "Menu",
  "/orders": "Orders",
};

function Header({ onMenuClick }) {
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname];

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-4 md:px-8">
      {/* Page information */}
      <div className="flex items-center gap-4">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
        >
          <HiOutlineBars3 className="h-6 w-6" />
        </button>

        {/* Page title */}
        <div>
          <p className="text-sm text-gray-500">RestaurantOS</p>

          <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>
      </div>

      {/* Header actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <HiOutlineBell className="h-5 w-5" />
        </button>

        {/* Theme */}
        <button
          type="button"
          aria-label="Toggle dark mode"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <HiOutlineMoon className="h-5 w-5" />
        </button>

        {/* User */}
        <div className="hidden border-l pl-4 sm:block">
          <p className="text-sm font-medium text-gray-900">Arafam</p>
          <p className="text-xs text-gray-500">Admin</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
