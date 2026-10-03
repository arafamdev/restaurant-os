import { usePermission } from "../../auth/hooks/usePermission";

export function useRestaurantDayPermissions() {
  const {
    hasPermission: canOpenRestaurant,
    isLoading: isOpeningPermissionLoading,
    error: openingPermissionError,
  } = usePermission("open_restaurant");

  const {
    hasPermission: canCloseRestaurant,
    isLoading: isClosingPermissionLoading,
    error: closingPermissionError,
  } = usePermission("close_restaurant");

  return {
    canOpenRestaurant,
    canCloseRestaurant,
    isLoading: isOpeningPermissionLoading || isClosingPermissionLoading,
    error: openingPermissionError || closingPermissionError,
  };
}
