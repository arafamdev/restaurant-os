import { BrowserRouter, Route, Routes } from "react-router-dom";

// Layout & protection
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Global context
import { RestaurantProvider } from "./context/RestaurantContext";

// Public pages
import AcceptInvite from "./features/auth/components/AcceptInvite";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

// Main pages
import Dashboard from "./pages/Dashboard";
import RestaurantDay from "./pages/RestaurantDay";
import Staff from "./pages/Staff";
import EmployeeDetails from "./pages/EmployeeDetails";
import Profile from "./pages/Profile";

// Reservations
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";
import ReservationDetails from "./pages/ReservationDetails";

// Tables
import Tables from "./pages/Tables";
import CreateTable from "./pages/CreateTable";
import TableDetails from "./pages/TableDetails";
import EditTable from "./pages/EditTable";

// Menu
import Menu from "./pages/Menu";
import MenuItemDetails from "./pages/MenuItemDetails";
import DailyMenu from "./pages/DailyMenu";

// Other pages
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/accept-invite" element={<AcceptInvite />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RestaurantProvider>
                <AppLayout />
              </RestaurantProvider>
            }
          >
            {/* Main */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurant-day" element={<RestaurantDay />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/staff/:employeeId" element={<EmployeeDetails />} />
            <Route path="/profile" element={<Profile />} />

            {/* Reservations */}
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/reservations/new" element={<NewReservation />} />
            <Route
              path="/reservations/:reservationId"
              element={<ReservationDetails />}
            />

            {/* Tables */}
            <Route path="/tables" element={<Tables />} />
            <Route path="/tables/new" element={<CreateTable />} />
            <Route path="/tables/:tableId" element={<TableDetails />} />
            <Route path="/tables/:tableId/edit" element={<EditTable />} />

            {/* Menu */}
            <Route path="/menu" element={<Menu />} />
            <Route path="/menu/:menuItemId" element={<MenuItemDetails />} />
            <Route path="/daily-menu" element={<DailyMenu />} />

            {/* Customers */}
            <Route path="/customers" element={<Customers />} />

            {/* Orders */}
            <Route path="/orders" element={<Orders />} />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
