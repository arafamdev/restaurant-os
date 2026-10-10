import {
  HiOutlineBuildingStorefront,
  HiOutlineChevronDown,
} from "react-icons/hi2";

import { useRestaurantContext } from "../../../context/useRestaurantContext";

function RestaurantSelector() {
  const {
    restaurants,
    isPlatformAdmin,
    isAllRestaurants,
    selectedRestaurant,
    isLoading,
    setRestaurant,
  } = useRestaurantContext();

  // Apenas o Platform Admin pode trocar de restaurante.
  if (!isPlatformAdmin) {
    return null;
  }

  const currentLabel = isAllRestaurants
    ? "All Restaurants"
    : selectedRestaurant?.name || "Select restaurant";

  return (
    <div className="relative">
      <label htmlFor="restaurant-selector" className="sr-only">
        Select restaurant
      </label>

      <div className="relative">
        <HiOutlineBuildingStorefront className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />

        <select
          id="restaurant-selector"
          value={isAllRestaurants ? "all" : selectedRestaurant?.id || ""}
          onChange={(event) => setRestaurant(event.target.value)}
          disabled={isLoading}
          className="h-10 min-w-[190px] appearance-none rounded-xl border border-gray-200 bg-white py-2 pr-9 pl-9 text-sm font-medium text-gray-800 transition-colors outline-none hover:border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#374151] dark:bg-[#111827] dark:text-[#F9FAFB] dark:hover:border-gray-500 dark:focus:border-emerald-500"
        >
          <option
            value="all"
            className="bg-white text-gray-900 dark:bg-[#111827] dark:text-white"
          >
            All Restaurants
          </option>

          {restaurants.map((restaurant) => (
            <option
              key={restaurant.id}
              value={restaurant.id}
              className="bg-white text-gray-900 dark:bg-[#111827] dark:text-white"
            >
              {restaurant.name}
            </option>
          ))}
        </select>

        <HiOutlineChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      </div>

      <span className="sr-only">{currentLabel}</span>
    </div>
  );
}

export default RestaurantSelector;
