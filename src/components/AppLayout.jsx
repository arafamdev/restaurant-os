import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="grid min-h-screen grid-cols-[16rem_1fr]">
      <Sidebar />

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
