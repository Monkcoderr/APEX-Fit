import { useState } from "react";
import { Outlet } from "react-router-dom";
import GymSidebar from "./gym/GymSidebar";
import GymHeader from "./gym/GymHeader";

export default function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}
            >
                <GymSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                <GymHeader onMenuClick={() => setSidebarOpen(true)} />

                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
