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
        <HiOutlineBuildingStorefront className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <select
          id="restaurant-selector"
          value={isAllRestaurants ? "all" : selectedRestaurant?.id || ""}
          onChange={(event) => setRestaurant(event.target.value)}
          disabled={isLoading}
          className="h-10 min-w-[190px] appearance-none rounded-xl border border-gray-200 bg-white py-2 pr-9 pl-9 text-sm font-medium text-gray-800 transition-colors outline-none hover:border-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="all">All Restaurants</option>

          {restaurants.map((restaurant) => (
            <option key={restaurant.id} value={restaurant.id}>
              {restaurant.name}
            </option>
          ))}
        </select>

        <HiOutlineChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>

      <span className="sr-only">{currentLabel}</span>
    </div>
  );
}

export default RestaurantSelector;
