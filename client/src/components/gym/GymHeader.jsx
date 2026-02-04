import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Search,
  Bell,
  MessageCircle,
  Menu,
  Plus,
  Sun,
  Moon,
  LogOut,
  User,
} from "lucide-react";

export default function GymHeader({ onMenuClick, onAddMember }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, admin } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved !== null) {
        return saved === "true";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Apply dark mode on mount and when it changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", isDarkMode.toString());
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      // Navigate to members page with search query
      navigate(`/members?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/") return "Dashboard";
    if (path.startsWith("/members")) return "Members";
    if (path.startsWith("/checkin")) return "Check-In";
    if (path.startsWith("/payments")) return "Payments";
    if (path.startsWith("/plans")) return "Plans";
    return "Dashboard";
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="h-16 bg-[#F3F3F3] dark:bg-[#1A1A1A] flex items-center justify-between px-4 md:px-6 flex-shrink-0 border-b border-[#E5E5E5] dark:border-[#333333]">
      {/* Left side - Mobile menu button and Page title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-all duration-150 hover:bg-[#F5F5F5] dark:hover:bg-[#1E1E1E] active:bg-[#EEEEEE] dark:active:bg-[#2A2A2A] active:scale-95"
        >
          <Menu size={20} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight font-inter">
            {getPageTitle()}
          </h1>
          <span className="text-xs text-[#6E6E6E] dark:text-[#888888] font-inter">
            Welcome back, Admin 👋
          </span>
        </div>
      </div>

      {/* Right side - Search, Action buttons and profile area */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search field */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search members, trainers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-[250px] h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-[#1E1E1E] border transition-all duration-200 font-inter text-sm text-black dark:text-white placeholder-[#6E6E6E] dark:placeholder-[#888888] placeholder-opacity-80 ${isSearchFocused
              ? "border-[#2563EB] dark:border-[#10B981] shadow-sm"
              : "border-[#E5E5E5] dark:border-[#333333] hover:border-[#D0D0D0] dark:hover:border-[#444444]"
              }`}
          />
          <Search
            size={16}
            className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${isSearchFocused
              ? "text-[#2563EB] dark:text-[#10B981]"
              : "text-[#6E6E6E] dark:text-[#888888]"
              }`}
          />
        </div>

        {/* Mobile search button */}
        <button
          onClick={() => navigate("/members")}
          className="md:hidden w-10 h-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center transition-all duration-150 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] hover:border-[#D0D0D0] dark:hover:border-[#444444] active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] active:scale-95"
        >
          <Search size={18} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center transition-all duration-150 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] hover:border-[#D0D0D0] dark:hover:border-[#444444] active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] active:scale-95"
        >
          {isDarkMode ? (
            <Sun size={18} className="text-[#F59E0B]" />
          ) : (
            <Moon size={18} className="text-[#4B4B4B]" />
          )}
        </button>

        {/* Add Member Button */}
        <button
          onClick={onAddMember}
          className="h-10 px-4 md:px-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white font-semibold text-sm transition-all duration-150 hover:from-[#1D4ED8] hover:to-[#059669] active:from-[#1E40AF] active:to-[#047857] active:scale-95 font-inter shadow-sm flex items-center gap-2"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add Member</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center transition-all duration-150 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] hover:border-[#D0D0D0] dark:hover:border-[#444444] active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] active:scale-95">
            <Bell size={18} className="text-[#4B4B4B] dark:text-[#B0B0B0]" />
          </button>
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#EF4444] rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white font-inter">
              3
            </span>
          </div>
        </div>

        {/* Message Circle - Hidden on small screens */}
        <div className="relative hidden sm:block">
          <button className="w-10 h-10 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] flex items-center justify-center transition-all duration-150 hover:bg-[#F8F8F8] dark:hover:bg-[#262626] hover:border-[#D0D0D0] dark:hover:border-[#444444] active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] active:scale-95">
            <MessageCircle
              size={18}
              className="text-[#4B4B4B] dark:text-[#B0B0B0]"
            />
          </button>
          {/* Message badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white font-inter">
              7
            </span>
          </div>
        </div>

        {/* User Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white dark:ring-[#333333] transition-all duration-150 hover:ring-[#E0E0E0] dark:hover:ring-[#444444]"
          >
            <div className="w-full h-full bg-gradient-to-br from-[#2563EB] to-[#10B981] flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </button>
          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#22C55E] border-2 border-white dark:border-[#1A1A1A] rounded-full"></div>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E1E1E] rounded-xl shadow-lg border border-[#E5E5E5] dark:border-[#333333] py-2 z-50">
                <div className="px-4 py-3 border-b border-[#E5E5E5] dark:border-[#333333]">
                  <p className="text-sm font-medium text-[#111827] dark:text-white font-inter">
                    {admin?.username || 'Admin'}
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter mt-0.5">
                    {admin?.email || 'admin@apexfit.com'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] transition-colors font-inter"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
