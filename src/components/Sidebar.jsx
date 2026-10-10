import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineCalendarDays,
  HiOutlineTableCells,
  HiOutlineUsers,
  HiOutlineClipboardDocumentList,
  HiOutlineShoppingBag,
  HiOutlineXMark,
  HiOutlineBuildingStorefront,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi2";

import restaurantLogoLight from "../assets/logo/logo-light.svg";
import restaurantLogoDark from "../assets/logo/logo-dark.svg";
import restaurantMarkLight from "../assets/logo/mark-light.svg";
import restaurantMarkDark from "../assets/logo/mark-dark.svg";

import { useRestaurantDay } from "../features/restaurantDay/hooks/useRestaurantDay";
import { useSidebarPermissions } from "../features/auth/hooks/useSidebarPermissions";

const navSections = [
  {
    label: "Main",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: HiOutlineHome },
      {
        to: "/restaurant-day",
        label: "Restaurant",
        icon: HiOutlineBuildingStorefront,
        isRestaurantDay: true,
        permission: "canViewRestaurantDay",
      },
      {
        to: "/reservations",
        label: "Reservations",
        icon: HiOutlineCalendarDays,
        permission: "canManageReservations",
      },
      {
        to: "/tables",
        label: "Tables",
        icon: HiOutlineTableCells,
        permission: "canViewTables",
      },
      { to: "/customers", label: "Customers", icon: HiOutlineUsers },
      {
        to: "/staff",
        label: "Staff",
        icon: HiOutlineUsers,
        permission: "canViewStaff",
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
        permission: "canViewMenu",
      },
      {
        to: "/daily-menu",
        label: "Daily Menu",
        icon: HiOutlineClipboardDocumentList,
        permission: "canViewMenu",
      },
      {
        to: "/orders",
        label: "Orders",
        icon: HiOutlineShoppingBag,
        permission: "canManageOrders",
      },
    ],
  },
];

function Sidebar({
  isSidebarOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const { restaurantDay, isLoading: isRestaurantDayLoading } =
    useRestaurantDay();

  const {
    canViewRestaurantDay,
    canManageReservations,
    canViewTables,
    canViewStaff,
    canViewMenu,
    canManageOrders,
  } = useSidebarPermissions();

  const isRestaurantOpen = Boolean(restaurantDay);

  const permissions = {
    canViewRestaurantDay,
    canManageReservations,
    canViewTables,
    canViewStaff,
    canViewMenu,
    canManageOrders,
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200/70 bg-white px-3 py-5 shadow-xl shadow-gray-950/5 transition-[width,transform,background-color,border-color] duration-300 lg:static lg:translate-x-0 lg:shadow-none dark:border-[#374151] dark:bg-[#111827] ${
        isCollapsed ? "lg:w-20" : "lg:w-64"
      } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Logótipo completo ou símbolo compacto */}
      <div
        className={`flex h-16 shrink-0 items-center ${
          isCollapsed ? "justify-center" : "justify-between gap-2 px-1"
        }`}
      >
        <NavLink
          to="/dashboard"
          onClick={onClose}
          aria-label="RestaurantOS — Dashboard"
          title="RestaurantOS"
          className={`flex min-w-0 items-center ${
            isCollapsed ? "justify-center" : "flex-1"
          }`}
        >
          {isCollapsed ? (
            <>
              <img
                src={restaurantMarkLight}
                alt="RestaurantOS"
                className="block h-10 w-10 object-contain dark:hidden"
              />
              <img
                src={restaurantMarkDark}
                alt="RestaurantOS"
                className="hidden h-10 w-10 object-contain dark:block"
              />
            </>
          ) : (
            <>
              <img
                src={restaurantLogoLight}
                alt="RestaurantOS"
                className="block h-auto max-h-12 w-full max-w-[210px] object-contain object-left dark:hidden"
              />
              <img
                src={restaurantLogoDark}
                alt="RestaurantOS"
                className="hidden h-auto max-h-12 w-full max-w-[210px] object-contain object-left dark:block"
              />
            </>
          )}
        </NavLink>

        {/* Fechar o menu em dispositivos móveis */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation menu"
          title="Close menu"
          className="shrink-0 rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-950 lg:hidden dark:text-gray-400 dark:hover:bg-[#1F2937] dark:hover:text-white"
        >
          <HiOutlineXMark className="h-5 w-5" />
        </button>
      </div>

      {/* Recolher ou expandir o Sidebar: apenas desktop */}
      <div
        className={`mt-3 hidden lg:flex ${
          isCollapsed ? "justify-center" : "justify-end px-1"
        }`}
      >
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand menu" : "Collapse menu"}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:text-gray-400 dark:hover:bg-[#1F2937] dark:hover:text-white"
        >
          {isCollapsed ? (
            <HiOutlineChevronDoubleRight className="h-5 w-5" />
          ) : (
            <HiOutlineChevronDoubleLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navegação */}
      <nav className="mt-5 flex-1 space-y-8 overflow-x-hidden overflow-y-auto">
        {navSections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.permission || permissions[item.permission],
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.label}>
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.16em] text-gray-400 uppercase dark:text-[#9CA3AF]">
                  {section.label}
                </p>
              )}

              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      title={isCollapsed ? item.label : undefined}
                      aria-label={item.label}
                      className={({ isActive }) =>
                        `group flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ${
                          isCollapsed ? "justify-center px-2" : "gap-3 px-3"
                        } ${
                          isActive
                            ? "bg-gray-950 text-white shadow-sm dark:bg-[#F9FAFB] dark:text-[#111827]"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-950 dark:text-[#9CA3AF] dark:hover:bg-[#1F2937] dark:hover:text-[#F9FAFB]"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`h-[19px] w-[19px] shrink-0 transition-transform duration-200 ${
                              isActive ? "scale-105" : "group-hover:scale-105"
                            }`}
                          />

                          {!isCollapsed && (
                            <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                              <span className="truncate">{item.label}</span>

                              {item.isRestaurantDay && (
                                <span className="flex shrink-0 items-center gap-1.5">
                                  {isRestaurantDayLoading ? (
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                                  ) : (
                                    <>
                                      <span
                                        className={`h-2 w-2 rounded-full ${
                                          isRestaurantOpen
                                            ? "bg-emerald-400"
                                            : "bg-red-400"
                                        }`}
                                      />
                                      <span
                                        className={`text-[10px] font-semibold ${
                                          isRestaurantOpen
                                            ? "text-emerald-500"
                                            : "text-red-400"
                                        }`}
                                      >
                                        {isRestaurantOpen ? "Open" : "Closed"}
                                      </span>
                                    </>
                                  )}
                                </span>
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Estado do restaurante */}
      <div className="mt-6 shrink-0">
        <div
          className={`rounded-2xl border border-gray-200/70 bg-gray-50 transition-colors duration-200 dark:border-[#374151] dark:bg-[#1F2937] ${
            isCollapsed ? "flex justify-center p-2" : "p-4"
          }`}
          title={
            isCollapsed
              ? isRestaurantOpen
                ? "Restaurant currently open"
                : "Restaurant currently closed"
              : undefined
          }
        >
          {isCollapsed ? (
            <span
              className={`mt-1 h-3 w-3 rounded-full ${
                isRestaurantDayLoading
                  ? "animate-pulse bg-gray-400"
                  : isRestaurantOpen
                    ? "bg-emerald-500"
                    : "bg-red-500"
              }`}
            />
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isRestaurantOpen
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
                      : "bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isRestaurantOpen ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-950 dark:text-[#F9FAFB]">
                    Restaurant
                  </p>

                  <p
                    className={`mt-0.5 text-xs font-medium ${
                      isRestaurantOpen
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {isRestaurantDayLoading
                      ? "Checking status..."
                      : isRestaurantOpen
                        ? "Currently open"
                        : "Currently closed"}
                  </p>
                </div>
              </div>

              {!isRestaurantDayLoading && (
                <div className="mt-3 flex items-center gap-2 border-t border-gray-200/70 pt-3 dark:border-[#374151]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isRestaurantOpen ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-[11px] text-gray-400 dark:text-[#9CA3AF]">
                    {isRestaurantOpen
                      ? "Restaurant day is active"
                      : "Restaurant day is closed"}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
