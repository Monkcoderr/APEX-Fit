import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  BarChart3,
  Dumbbell,
  Calendar,
  MessageCircle,
  Settings,
  ChevronDown,
  TrendingUp,
} from "lucide-react";

export default function GymSidebar({ onClose }) {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (item) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleItemClick = (itemName, hasSubmenu, route) => {
    setActiveItem(itemName);
    if (hasSubmenu) {
      toggleSubmenu(itemName);
    } else if (route && typeof window !== "undefined") {
      // Simple navigation using window.location
      window.location.href = route;
    }
    // Close sidebar on mobile when item is clicked
    if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  const navigationItems = [
    { name: "Dashboard", icon: LayoutDashboard, hasSubmenu: false, route: "/" },
    { name: "Members", icon: Users, hasSubmenu: true, route: "/members" },
    {
      name: "Trainers",
      icon: UserCheck,
      hasSubmenu: false,
      route: "/trainers",
    },
    { name: "Workouts", icon: Dumbbell, hasSubmenu: false, route: "/workouts" },
    { name: "Schedule", icon: Calendar, hasSubmenu: false },
    { name: "Payments", icon: CreditCard, hasSubmenu: true },
    { name: "Analytics", icon: BarChart3, hasSubmenu: false },
    { name: "Messages", icon: MessageCircle, hasSubmenu: false },
    { name: "Settings", icon: Settings, hasSubmenu: false },
  ];

  return (
    <div className="w-60 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full">
      {/* Brand Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#10B981] rounded-xl flex items-center justify-center">
          <Dumbbell size={24} className="text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-[#2B2B2B] dark:text-white font-bricolage">
            FitFlow Pro
          </h1>
          <span className="text-xs text-[#7F7F7F] dark:text-[#AAAAAA] font-inter">
            Gym Management
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            const isExpanded = expandedMenus[item.name];

            return (
              <div key={item.name}>
                <button
                  onClick={() =>
                    handleItemClick(item.name, item.hasSubmenu, item.route)
                  }
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-white dark:bg-[#262626] border border-[#E4E4E4] dark:border-[#404040] text-black dark:text-white shadow-sm"
                      : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 active:bg-white/70 dark:active:bg-white/15 active:scale-[0.98]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? "text-[#2563EB] dark:text-[#10B981]"
                          : "text-black/70 dark:text-white/70"
                      }
                    />
                    <span
                      className={`font-medium text-sm font-plus-jakarta ${
                        isActive
                          ? "text-black dark:text-white"
                          : "text-black/70 dark:text-white/70"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  {item.hasSubmenu && (
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      } ${isActive ? "text-black dark:text-white" : "text-black/70 dark:text-white/70"}`}
                    />
                  )}
                </button>

                {/* Submenu items */}
                {item.hasSubmenu && isExpanded && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.name === "Members" && (
                      <>
                        <button className="w-full text-left px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 font-inter">
                          All Members
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 font-inter">
                          Membership Plans
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 font-inter">
                          Check-ins
                        </button>
                      </>
                    )}
                    {item.name === "Payments" && (
                      <>
                        <button className="w-full text-left px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 font-inter">
                          Transactions
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 font-inter">
                          Invoices
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors duration-200 font-inter">
                          Refunds
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Stats Card */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-[#2563EB] to-[#10B981] rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} />
            <span className="font-medium text-sm font-plus-jakarta">
              This Month
            </span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold font-sora">$12,847</div>
            <div className="text-xs opacity-90 font-inter">
              +23% from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
