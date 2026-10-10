import {
  HiOutlineBanknotes,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCurrencyEuro,
  HiOutlineUsers,
} from "react-icons/hi2";

const stats = [
  {
    label: "Today's revenue",
    value: "€1,284.50",
    change: "+12.8%",
    description: "Compared with yesterday",
    icon: HiOutlineCurrencyEuro,
  },
  {
    label: "Reservations",
    value: "24",
    change: "+4",
    description: "Compared with yesterday",
    icon: HiOutlineCalendarDays,
  },
  {
    label: "Active customers",
    value: "68",
    change: "+8.2%",
    description: "Customers served today",
    icon: HiOutlineUsers,
  },
  {
    label: "Available tables",
    value: "8 / 20",
    change: "40%",
    description: "Tables currently available",
    icon: HiOutlineBanknotes,
  },
];

const weeklyRevenue = [
  { day: "Mon", amount: 45 },
  { day: "Tue", amount: 62 },
  { day: "Wed", amount: 52 },
  { day: "Thu", amount: 78 },
  { day: "Fri", amount: 66 },
  { day: "Sat", amount: 92 },
  { day: "Sun", amount: 70 },
];

const reservations = [
  {
    id: 1,
    name: "Sofia Martins",
    time: "12:30",
    guests: 2,
    table: "T04",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Miguel Costa",
    time: "13:00",
    guests: 4,
    table: "T08",
    status: "Seated",
  },
  {
    id: 3,
    name: "Inês Ferreira",
    time: "13:30",
    guests: 3,
    table: "T12",
    status: "Pending",
  },
  {
    id: 4,
    name: "João Silva",
    time: "14:00",
    guests: 6,
    table: "T15",
    status: "Confirmed",
  },
];

const activities = [
  {
    id: 1,
    title: "Reservation confirmed",
    detail: "Sofia Martins · Table T04",
    time: "5 min ago",
    icon: HiOutlineCheckCircle,
  },
  {
    id: 2,
    title: "Restaurant day opened",
    detail: "The restaurant is ready for service",
    time: "28 min ago",
    icon: HiOutlineClock,
  },
  {
    id: 3,
    title: "Payment received",
    detail: "Table T02 · €86.50",
    time: "42 min ago",
    icon: HiOutlineBanknotes,
  },
];

function StatusBadge({ status }) {
  const styles = {
    Confirmed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    Seated: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
    Pending:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] ??
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  );
}

function Home() {
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page heading */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{today}</p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl dark:text-[#F9FAFB]">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500 dark:text-[#9CA3AF]">
            Here is what's happening at your restaurant today.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 dark:border-[#374151] dark:bg-[#111827] dark:text-gray-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Demo dashboard
        </span>
      </header>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-colors dark:border-[#374151] dark:bg-[#111827]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-[#9CA3AF]">
                    {stat.label}
                  </p>

                  <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-950 dark:text-[#F9FAFB]">
                    {stat.value}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-100 p-2.5 dark:bg-[#1F2937]">
                  <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {stat.change}
                </span>

                <span className="text-gray-500 dark:text-[#9CA3AF]">
                  {stat.description}
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Revenue and table availability */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-[#374151] dark:bg-[#111827]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-950 dark:text-[#F9FAFB]">
                Revenue overview
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
                Illustrative weekly performance
              </p>
            </div>

            <span className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 dark:border-[#374151] dark:text-gray-300">
              This week
            </span>
          </div>

          <div className="mt-7">
            <p className="text-3xl font-semibold tracking-tight text-gray-950 dark:text-[#F9FAFB]">
              €8,642.80
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
              Total simulated revenue
            </p>
          </div>

          <div className="mt-7 grid h-44 grid-cols-7 items-end gap-3 sm:gap-5">
            {weeklyRevenue.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-col items-center justify-end gap-3"
              >
                <div className="flex h-full w-full items-end">
                  <div
                    title={`${item.amount}% of weekly peak`}
                    className="w-full rounded-t-md bg-emerald-600/80 transition-colors hover:bg-emerald-500 dark:bg-emerald-800 dark:hover:bg-emerald-700"
                    style={{ height: `${item.amount}%` }}
                  />
                </div>

                <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-[#374151] dark:bg-[#111827]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-950 dark:text-[#F9FAFB]">
                Table availability
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
                Current simulated status
              </p>
            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              20 tables
            </span>
          </div>

          <div className="mt-7 flex items-center gap-6">
            <div
              className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
              style={{
                background:
                  "conic-gradient(#047857 0% 40%, #374151 40% 85%, #92400e 85% 100%)",
              }}
              role="img"
              aria-label="40% available, 45% occupied and 15% in maintenance"
            >
              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white dark:bg-[#111827]">
                <span className="text-2xl font-semibold text-gray-950 dark:text-[#F9FAFB]">
                  40%
                </span>
                <span className="text-xs text-gray-500 dark:text-[#9CA3AF]">
                  Available
                </span>
              </div>
            </div>

            <div className="min-w-0 space-y-4">
              {[
                {
                  label: "Available",
                  count: 8,
                  color: "bg-emerald-700 dark:bg-emerald-600",
                },
                {
                  label: "Occupied",
                  count: 9,
                  color: "bg-gray-600 dark:bg-gray-500",
                },
                {
                  label: "Maintenance",
                  count: 3,
                  color: "bg-amber-700 dark:bg-amber-600",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-sm ${item.color}`}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="ml-auto text-sm font-semibold text-gray-950 dark:text-[#F9FAFB]">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-[#374151] dark:bg-[#1F2937]">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Restaurant status
            </p>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
              This is an example status. It is not connected to the restaurant
              opening system.
            </p>
          </div>
        </article>
      </section>

      {/* Reservations and recent activity */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_1fr]">
        <article className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-[#374151] dark:bg-[#111827]">
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:px-6 dark:border-[#374151]">
            <div>
              <h2 className="font-semibold text-gray-950 dark:text-[#F9FAFB]">
                Upcoming reservations
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
                Today's reservation schedule
              </p>
            </div>

            <HiOutlineCalendarDays className="h-5 w-5 text-gray-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 dark:bg-[#1F2937] dark:text-gray-400">
                <tr>
                  <th className="px-5 py-3 font-medium sm:px-6">Guest</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Guests</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-[#374151]">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-5 py-4 sm:px-6">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {reservation.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Table {reservation.table}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {reservation.time}
                    </td>
                    <td className="px-4 py-4 text-gray-600 dark:text-gray-300">
                      {reservation.guests}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={reservation.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-200 px-5 py-3 sm:px-6 dark:border-[#374151]">
            <p className="text-xs text-gray-500 dark:text-[#9CA3AF]">
              Demonstration data · No real reservations are displayed.
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 dark:border-[#374151] dark:bg-[#111827]">
          <div>
            <h2 className="font-semibold text-gray-950 dark:text-[#F9FAFB]">
              Recent activity
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-[#9CA3AF]">
              Example restaurant events
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1F2937]">
                    <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-[#9CA3AF]">
                      {activity.detail}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {activity.time}
                    </p>
                  </div>

                  {index < activities.length - 1 && (
                    <span className="sr-only">Next activity</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-[#374151]">
            <p className="text-xs leading-5 text-gray-500 dark:text-[#9CA3AF]">
              Activity history will be connected to real system events in a
              future implementation.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Home;
