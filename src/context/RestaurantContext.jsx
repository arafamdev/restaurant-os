import { useMemo, useState } from "react";
import { useCurrentUserContext } from "../features/auth/hooks/useCurrentUserContext";
import { useRestaurants } from "../features/restaurants/hooks/useRestaurants";
import { RestaurantContext } from "./RestaurantContextDefinition";

export function RestaurantProvider({ children }) {
  const { userContext, isLoading: isUserLoading } = useCurrentUserContext();

  const {
    restaurants = [],
    isLoading: isRestaurantsLoading,
    error,
  } = useRestaurants();

  const isPlatformAdmin = userContext?.is_platform_admin === true;
  const userRestaurantId = userContext?.restaurant_id ?? null;

  const [selectedRestaurantId, setSelectedRestaurantId] = useState("all");

  const restaurantId = isPlatformAdmin
    ? selectedRestaurantId
    : userRestaurantId;

  const isAllRestaurants = restaurantId === "all";

  const selectedRestaurant = useMemo(() => {
    if (isAllRestaurants) {
      return null;
    }

    return (
      restaurants.find((restaurant) => restaurant.id === restaurantId) ?? null
    );
  }, [isAllRestaurants, restaurantId, restaurants]);

  function setRestaurant(id) {
    if (!isPlatformAdmin) {
      return;
    }

    if (id === "all") {
      setSelectedRestaurantId("all");
      return;
    }

    setSelectedRestaurantId(Number(id));
  }

  const value = {
    restaurantId,
    isAllRestaurants,
    selectedRestaurant,
    restaurants,
    isPlatformAdmin,
    isLoading: isUserLoading || isRestaurantsLoading,
    error,
    setRestaurant,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}
