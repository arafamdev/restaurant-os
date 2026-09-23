import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((isOpen) => !isOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[5rem_1fr] lg:grid-cols-[16rem_1fr]">
      <Sidebar isSidebarOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-gray-900/20 md:hidden"
        />
      )}

      <main className="min-w-0">
        <Header onMenuClick={toggleSidebar} />

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
