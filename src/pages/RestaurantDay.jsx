import { useState } from "react";

import RestaurantDayStatus from "../features/restaurantDay/components/RestaurantDayStatus";
import RestaurantDaySummary from "../features/restaurantDay/components/RestaurantDaySummary";
import OpenRestaurantDayForm from "../features/restaurantDay/components/OpenRestaurantDayForm";
import CloseRestaurantDayForm from "../features/restaurantDay/components/CloseRestaurantDayForm";

import { useRestaurantDay } from "../features/restaurantDay/hooks/useRestaurantDay";

function RestaurantDay() {
  const { restaurantDay, latestRestaurantDay, isLoading, error } =
    useRestaurantDay();

  const [isOpenModalOpen, setIsOpenModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  if (isLoading) {
    return <p>Loading restaurant day...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error.message}</p>;
  }

  const isRestaurantOpen = Boolean(restaurantDay);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Restaurant Day</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the opening and closing of the restaurant day.
        </p>
      </div>

      <RestaurantDayStatus
        restaurantDay={restaurantDay}
        onOpen={() => setIsOpenModalOpen(true)}
        onClose={() => setIsCloseModalOpen(true)}
      />

      {!isRestaurantOpen && (
        <RestaurantDaySummary restaurantDay={latestRestaurantDay} />
      )}

      <OpenRestaurantDayForm
        isOpen={isOpenModalOpen}
        onClose={() => setIsOpenModalOpen(false)}
      />

      <CloseRestaurantDayForm
        isOpen={isCloseModalOpen}
        onClose={() => setIsCloseModalOpen(false)}
      />
    </div>
  );
}

export default RestaurantDay;
