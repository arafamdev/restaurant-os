import { useCurrentUserContext } from "./useCurrentUserContext";
import { useHasPermission } from "./useHasPermission";

export function useSidebarPermissions() {
  const { userContext, isLoading: isUserContextLoading } =
    useCurrentUserContext();

  const isPlatformAdmin = Boolean(userContext?.is_platform_admin);

  const restaurantDay = useHasPermission("view_restaurant_day");
  const reservations = useHasPermission("manage_reservations");
  const tables = useHasPermission("view_tables");
  const staff = useHasPermission("view_staff");
  const menu = useHasPermission("view_menu");
  const orders = useHasPermission("manage_orders");

  const isLoading =
    isUserContextLoading ||
    restaurantDay.isLoading ||
    reservations.isLoading ||
    tables.isLoading ||
    staff.isLoading ||
    menu.isLoading ||
    orders.isLoading;

  const hasError =
    restaurantDay.error ||
    reservations.error ||
    tables.error ||
    staff.error ||
    menu.error ||
    orders.error;

  return {
    isPlatformAdmin,
    isLoading,
    error: hasError,

    canViewRestaurantDay: isPlatformAdmin || restaurantDay.hasPermission,
    canManageReservations: isPlatformAdmin || reservations.hasPermission,
    canViewTables: isPlatformAdmin || tables.hasPermission,
    canViewStaff: isPlatformAdmin || staff.hasPermission,
    canViewMenu: isPlatformAdmin || menu.hasPermission,
    canManageOrders: isPlatformAdmin || orders.hasPermission,
  };
}
