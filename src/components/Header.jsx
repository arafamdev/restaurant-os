import { useLocation } from "react-router-dom";

import {
  HiOutlineBell,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineBars3,
} from "react-icons/hi2";

import { useRestaurantContext } from "../context/useRestaurantContext";
import { useTheme } from "../context/useTheme";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";
import RestaurantSelector from "../features/restaurants/components/RestaurantSelector";
import ProfileMenu from "../features/profile/components/ProfileMenu";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/restaurant-day": "Restaurant",
  "/reservations": "Reservations",
  "/tables": "Tables",
  "/customers": "Customers",
  "/staff": "Staff",
  "/menu": "Menu",
  "/daily-menu": "Daily Menu",
  "/orders": "Orders",
  "/profile": "Profile",
};

function Header({ onMenuClick }) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { userContext, isLoading: isUserLoading } = useCurrentUserContext();

  const {
    isAllRestaurants,
    selectedRestaurant,
    isLoading: isRestaurantLoading,
  } = useRestaurantContext();

  const pageTitle = pageTitles[location.pathname] || "RestaurantOS";

  const restaurantName = isAllRestaurants
    ? "All Restaurants"
    : selectedRestaurant?.name ||
      userContext?.restaurant_name ||
      "RestaurantOS";

  const isLoading = isUserLoading || isRestaurantLoading;
  const isDarkMode = theme === "dark";

  return (
    <header className="sticky top-0 z-30 h-20 shrink-0 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl transition-colors duration-200 dark:border-[#374151] dark:bg-[#111827]/95">
      <div className="flex h-full min-w-0 items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:gap-4 lg:px-8">
        {/* Esquerda: menu e título */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            title="Open navigation menu"
            className="shrink-0 rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 lg:hidden dark:text-gray-300 dark:hover:bg-[#1F2937] dark:hover:text-white"
          >
            <HiOutlineBars3 className="h-6 w-6" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span
                title={isLoading ? "Loading..." : restaurantName}
                className="truncate text-xs font-medium text-gray-400 dark:text-[#9CA3AF]"
              >
                {isLoading ? "Loading..." : restaurantName}
              </span>

              {!isLoading && (
                <span className="hidden h-1 w-1 shrink-0 rounded-full bg-gray-300 sm:block dark:bg-[#374151]" />
              )}

              <span className="hidden shrink-0 text-xs text-gray-400 xl:block dark:text-[#9CA3AF]">
                RestaurantOS
              </span>
            </div>

            <h1
              title={pageTitle}
              className="mt-0.5 truncate text-base font-semibold tracking-tight text-gray-950 sm:text-lg xl:text-xl dark:text-[#F9FAFB]"
            >
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Direita: seletor e controlos */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2">
          {/* O seletor mantém uma largura limitada em tablets */}
          <div className="max-w-[150px] min-w-0 sm:max-w-[190px] lg:max-w-none">
            <RestaurantSelector />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            title="Notifications"
            className="relative shrink-0 rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-[#1F2937] dark:hover:text-white"
          >
            <HiOutlineBell className="h-[19px] w-[19px]" />

            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#111827]" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            title={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            aria-pressed={isDarkMode}
            className="shrink-0 rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-[#1F2937] dark:hover:text-white"
          >
            {isDarkMode ? (
              <HiOutlineSun className="h-[19px] w-[19px]" />
            ) : (
              <HiOutlineMoon className="h-[19px] w-[19px]" />
            )}
          </button>

          <div className="mx-0.5 hidden h-8 w-px bg-gray-200 sm:block dark:bg-[#374151]" />

          <div className="min-w-0 shrink-0">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
