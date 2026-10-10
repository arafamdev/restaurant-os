import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "../components/Footer";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  function toggleSidebar() {
    setIsCollapsed((current) => !current);
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-gray-50 text-gray-950 transition-colors duration-200 dark:bg-[#0B1120] dark:text-[#F9FAFB]">
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-gray-950/30 backdrop-blur-sm lg:hidden dark:bg-black/60"
        />
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          onClose={closeSidebar}
          isCollapsed={isCollapsed}
          onToggleCollapse={toggleSidebar}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          <div className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-[#0B1120]">
            <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
              <Outlet />
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
