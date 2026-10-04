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

const navSections = [
  {
    label: "Main",
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
    label: "Management",
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
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200/70 bg-white px-4 py-5 shadow-xl shadow-gray-950/5 transition-transform duration-300 lg:static lg:w-64 lg:translate-x-0 lg:shadow-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} `}
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center justify-between px-2">
        <img
          src={restaurantLogo}
          alt="RestaurantOS"
          className="h-9 w-auto lg:block"
        />

        <img
          src={restaurantMark}
          alt="RestaurantOS"
          className="hidden h-9 w-9"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          className="rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-950 lg:hidden"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex-1 space-y-8 overflow-hidden">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.16em] text-gray-400 uppercase">
              {section.label}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-gray-950 text-white shadow-sm"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-950"
                      } `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-[19px] w-[19px] shrink-0 transition-transform duration-200 ${
                            isActive ? "scale-105" : "group-hover:scale-105"
                          } `}
                        />

                        <span className="flex min-w-0 flex-1 items-center justify-between">
                          <span className="truncate">{item.label}</span>

                          {item.isRestaurantDay && (
                            <span className="ml-2 flex items-center gap-1.5">
                              {isLoading ? (
                                <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300" />
                              ) : (
                                <>
                                  <span
                                    className={`h-2 w-2 rounded-full ${
                                      isRestaurantOpen
                                        ? "bg-emerald-400"
                                        : "bg-red-400"
                                    } `}
                                  />

                                  <span
                                    className={`text-[10px] font-semibold ${
                                      isRestaurantOpen
                                        ? "text-emerald-500"
                                        : "text-red-400"
                                    } `}
                                  >
                                    {isRestaurantOpen ? "Open" : "Closed"}
                                  </span>
                                </>
                              )}
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Restaurant status */}
      <div className="mt-6 shrink-0">
        <div className="rounded-2xl border border-gray-200/70 bg-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                isRestaurantOpen
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-500"
              } `}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${isRestaurantOpen ? "bg-emerald-500" : "bg-red-500"} `}
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-950">Restaurant</p>

              <p
                className={`mt-0.5 text-xs font-medium ${
                  isRestaurantOpen ? "text-emerald-600" : "text-red-500"
                } `}
              >
                {isLoading
                  ? "Checking status..."
                  : isRestaurantOpen
                    ? "Currently open"
                    : "Currently closed"}
              </p>
            </div>
          </div>

          {!isLoading && (
            <div className="mt-3 flex items-center gap-2 border-t border-gray-200/70 pt-3">
              <span
                className={`h-1.5 w-1.5 rounded-full ${isRestaurantOpen ? "bg-emerald-500" : "bg-red-500"} `}
              />

              <span className="text-[11px] text-gray-400">
                {isRestaurantOpen
                  ? "Restaurant day is active"
                  : "Restaurant day is closed"}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
