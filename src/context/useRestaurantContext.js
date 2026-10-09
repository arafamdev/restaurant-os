import { useContext } from "react";
import { RestaurantContext } from "./RestaurantContextDefinition";

export function useRestaurantContext() {
  const context = useContext(RestaurantContext);

  if (!context) {
    throw new Error(
      "useRestaurantContext must be used inside RestaurantProvider",
    );
  }

  return context;
}
