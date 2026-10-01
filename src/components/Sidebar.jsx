import { NavLink } from "react-router-dom";

import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineTableCells,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineShoppingBag,
  HiOutlineXMark,
  HiOutlineSun,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";

import restaurantLogo from "../assets/logo/logo-light.svg";
import restaurantMark from "../assets/logo/mark-light.svg";

import { useRestaurantDay } from "../features/restaurantDay/hooks/useRestaurantDay";

const navItems = [
  {
    section: "MAIN",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: HiOutlineHome,
      },
      {
        to: "/restaurant-day",
        label: "Restaurant",
        icon: HiOutlineBuildingStorefront,
        isRestaurantDay: true,
      },
      {
        to: "/reservations",
        label: "Reservations",
        icon: HiOutlineCalendarDays,
      },
      {
        to: "/tables",
        label: "Tables",
        icon: HiOutlineTableCells,
      },
      {
        to: "/customers",
        label: "Customers",
        icon: HiOutlineUsers,
      },
      {
        to: "/staff",
        label: "Staff",
        icon: HiOutlineUsers,
      },
    ],
  },
  {
    section: "MANAGEMENT",
    items: [
      {
        to: "/menu",
        label: "Menu",
        icon: HiOutlineClipboardDocumentList,
      },
      {
        to: "/daily-menu",
        label: "Daily Menu",
        icon: HiOutlineSun,
      },
      {
        to: "/orders",
        label: "Orders",
        icon: HiOutlineShoppingBag,
      },
    ],
  },
];

function Sidebar({ isSidebarOpen, onClose }) {
  const { restaurantDay, isLoading } = useRestaurantDay();

  const isRestaurantOpen = Boolean(restaurantDay);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 h-screen w-64 border-r bg-white px-4 py-6 transition-transform duration-300 md:static md:h-auto md:w-auto md:translate-x-0 md:transition-none ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Close button - mobile */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close navigation menu"
        className="absolute top-4 right-4 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
      >
        <HiOutlineXMark className="h-6 w-6" />
      </button>

      {/* Logo */}
      <div className="mb-8 px-4">
        <img
          src={restaurantLogo}
          alt="RestaurantOS"
          className="h-12 w-auto md:hidden lg:block"
        />

        <img
          src={restaurantMark}
          alt="RestaurantOS"
          className="hidden h-10 w-10 md:block lg:hidden"
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-6">
        {navItems.map((section) => (
          <div key={section.section}>
            <p className="mb-3 px-4 text-xs font-semibold tracking-wider text-gray-400 uppercase md:hidden lg:block">
              {section.section}
            </p>

            <div className="space-y-2">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors md:justify-center md:px-3 lg:justify-start lg:px-4 ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />

                    <span className="flex min-w-0 flex-1 items-center justify-between md:hidden lg:flex">
                      <span>{item.label}</span>

                      {item.isRestaurantDay && (
                        <span className="ml-2 flex items-center gap-1 text-xs">
                          {isLoading ? (
                            <span className="h-2 w-2 rounded-full bg-gray-300" />
                          ) : (
                            <>
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isRestaurantOpen
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />

                              <span
                                className={
                                  isRestaurantOpen
                                    ? "text-green-600"
                                    : "text-red-500"
                                }
                              >
                                {isRestaurantOpen ? "Open" : "Closed"}
                              </span>
                            </>
                          )}
                        </span>
                      )}
                    </span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
