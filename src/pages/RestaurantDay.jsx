import { useState } from "react";
import { HiOutlineClock } from "react-icons/hi2";

import PageHeader from "../ui/PageHeader";
import Spinner from "../ui/Spinner";
import ErrorMessage from "../ui/ErrorMessage";

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
    return (
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#111827]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-5 dark:border-red-900/60 dark:bg-[#111827]">
        <ErrorMessage message={error.message} />
      </div>
    );
  }

  const isRestaurantOpen = Boolean(restaurantDay);

  return (
    <div className="min-h-full space-y-6 bg-gray-50/70 p-4 sm:p-6 dark:bg-[#0B1120]">
      <PageHeader
        icon={HiOutlineClock}
        title="Restaurant Day"
        description="Manage the opening and closing of the restaurant day."
      />

      <section className="space-y-6">
        <RestaurantDayStatus
          restaurantDay={restaurantDay}
          onOpen={() => setIsOpenModalOpen(true)}
          onClose={() => setIsCloseModalOpen(true)}
        />

        {!isRestaurantOpen && (
          <RestaurantDaySummary restaurantDay={latestRestaurantDay} />
        )}
      </section>

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
