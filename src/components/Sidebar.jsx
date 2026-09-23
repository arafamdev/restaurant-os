import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="border-r bg-gray-100 p-6">
      <h2 className="mb-8 text-xl font-bold">RestaurantOS</h2>

      <nav className=" flex-col flex">
        <NavLink
          to={"/dashboard"}
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Dashboard
        </NavLink>

        <NavLink
          to={"/reservations"}
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Reservations
        </NavLink>

        <NavLink
          to={"/tables"}
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Tables
        </NavLink>

        <NavLink
          to={"/customers"}
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Customers
        </NavLink>

        <NavLink
          to={"/menu"}
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Menu
        </NavLink>

        <NavLink
          to={"/orders"}
          className={({ isActive }) => (isActive ? "font-bold" : "")}
        >
          Orders
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
