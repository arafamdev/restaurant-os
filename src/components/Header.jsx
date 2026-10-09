import { useLocation } from "react-router-dom";
import { HiOutlineBell, HiOutlineMoon, HiOutlineBars3 } from "react-icons/hi2";
import { useRestaurantContext } from "../context/useRestaurantContext";
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

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-gray-200/70 bg-white/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950 lg:hidden"
          >
            <HiOutlineBars3 className="h-6 w-6" />
          </button>

          <div className="min-w-0">
            {/* Restaurant context */}
            <div className="flex items-center gap-2">
              <span className="truncate text-xs font-medium text-gray-400">
                {isLoading ? "Loading..." : restaurantName}
              </span>

              {!isLoading && (
                <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />
              )}

              <span className="hidden text-xs text-gray-400 sm:block">
                RestaurantOS
              </span>
            </div>

            {/* Page title */}
            <h1 className="mt-0.5 truncate text-lg font-semibold tracking-tight text-gray-950 sm:text-xl">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Restaurant context selector */}
          <RestaurantSelector />

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950"
          >
            <HiOutlineBell className="h-[19px] w-[19px]" />

            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Theme */}
          <button
            type="button"
            aria-label="Toggle dark mode"
            className="rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-950"
          >
            <HiOutlineMoon className="h-[19px] w-[19px]" />
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

          {/* Profile */}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
