import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  TrendingDown,
  Users,
  IndianRupee,
  Activity,
  Target,
  Calendar,
  Clock,
  ChevronDown,
  Plus,
  Filter,
  MoreHorizontal,
} from "lucide-react";
import RevenueAnalytics from "./RevenueAnalytics";
import { API_BASE_URL } from "../../config";

export default function GymDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [hoveredKPI, setHoveredKPI] = useState(null);

  // Fetch Stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const revenue = stats?.revenue || 0;
  const activeMembers = stats?.activeMembers || 0;
  const expiredMembers = stats?.expiredMembers || 0;
  const todayCheckIns = stats?.todayCheckIns || 0;

  // KPI Data (Dynamic)
  const kpiData = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: `₹${revenue.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: IndianRupee,
      color: "from-[#2563EB] to-[#1D4ED8]",
      bgColor:
        "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    },
    {
      id: "members",
      title: "Active Members",
      value: activeMembers.toString(),
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "from-[#10B981] to-[#059669]",
      bgColor:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    },
    {
      id: "expired",
      title: "Expired Members",
      value: expiredMembers.toString(),
      change: "-2.1%",
      trend: "down",
      icon: Target,
      color: "from-[#F59E0B] to-[#D97706]",
      bgColor:
        "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
    },
    {
      id: "checkins",
      title: "Today's Check-ins",
      value: todayCheckIns.toString(),
      change: "+15.3%",
      trend: "up",
      icon: Activity,
      color: "from-[#8B5CF6] to-[#7C3AED]",
      bgColor:
        "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    },
  ];

  if (isLoading) return <div className="p-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">Loading Dashboard...</div>;

  // Recent activities
  const activities = [
    {
      id: 1,
      type: "member_joined",
      user: "Priya Sharma",
      action: "joined the gym",
      time: "2 minutes ago",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2",
    },
    {
      id: 2,
      type: "payment",
      user: "Rahul Verma",
      action: "completed payment",
      time: "5 minutes ago",
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2",
    },
    {
      id: 3,
      type: "workout",
      user: "Anjali Singh",
      action: "completed workout",
      time: "12 minutes ago",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2",
    },
  ];

  // Today's schedule
  const todaySchedule = [
    { time: "07:00 AM", activity: "Morning Yoga", trainer: "Amit Patel", participants: 12 },
    { time: "09:00 AM", activity: "HIIT Training", trainer: "Vikram Singh", participants: 8 },
    { time: "05:00 PM", activity: "Strength Training", trainer: "Deepa Reddy", participants: 15 },
    { time: "07:00 PM", activity: "Cardio Blast", trainer: "Neha Gupta", participants: 20 },
  ];

  return (
    <div className="p-3 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#2B2B2B] dark:text-white font-sora">
            Overview
          </h2>
          <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF] font-inter mt-1">
            Track your gym's performance and growth
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] rounded-xl px-4 py-2 pr-10 font-inter text-sm text-[#374151] dark:text-[#D1D5DB] cursor-pointer hover:border-[#D0D0D0] dark:hover:border-[#444444] transition-colors duration-200"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] rounded-xl font-inter text-sm text-[#374151] dark:text-[#D1D5DB] hover:border-[#D0D0D0] dark:hover:border-[#444444] transition-colors duration-200">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const isHovered = hoveredKPI === kpi.id;

          return (
            <div
              key={kpi.id}
              className={`relative p-6 rounded-xl border border-[#E5E5E5] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 text-left ${kpi.bgColor} group cursor-pointer`}
              onMouseEnter={() => setHoveredKPI(kpi.id)}
              onMouseLeave={() => setHoveredKPI(null)}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${kpi.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-[#6B7280] dark:text-[#9CA3AF] font-inter">{kpi.title}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-2xl md:text-3xl font-bold text-[#111827] dark:text-white font-sora">{kpi.value}</span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold font-inter ${kpi.trend === "up" ? "bg-[#DCFCE7] dark:bg-green-900/30 text-[#16A34A] dark:text-green-400" : "bg-[#FEF2F2] dark:bg-red-900/30 text-[#DC2626] dark:text-red-400"}`}>
                    {kpi.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {kpi.change}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Revenue Analytics Chart */}
        <div className="xl:col-span-2">
          <RevenueAnalytics />
        </div>

        {/* Today's Schedule */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E5E5] dark:border-[#333333] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#111827] dark:text-white font-bricolage">Today's Schedule</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">{todaySchedule.length} sessions planned</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors duration-200">
              <MoreHorizontal size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
            </button>
          </div>

          <div className="space-y-4">
            {todaySchedule.map((session, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors duration-200 group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#10B981] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-[#111827] dark:text-white font-inter text-sm truncate">{session.activity}</h4>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">{session.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">{session.trainer}</span>
                    <span className="text-xs font-medium text-[#2563EB] dark:text-[#60A5FA] font-inter">{session.participants} people</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 border-2 border-dashed border-[#D1D5DB] dark:border-[#4B5563] rounded-xl text-[#6B7280] dark:text-[#9CA3AF] hover:border-[#2563EB] dark:hover:border-[#60A5FA] hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors duration-200 flex items-center justify-center gap-2 font-inter text-sm">
            <Plus size={16} />
            Add New Session
          </button>
        </div>
      </div>

      {/* Expiring Soon & Recent Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        {/* Expiring Members */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E5E5] dark:border-[#333333] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#111827] dark:text-white font-bricolage">Expiring Soon (7 Days)</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">{stats?.expiringSoon?.length || 0} members expiring</p>
            </div>
            <button className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors duration-200 font-inter">View All</button>
          </div>

          <div className="space-y-4">
            {stats?.expiringSoon?.length > 0 ? (
              stats.expiringSoon.map((member, index) => (
                <div key={member._id || index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors duration-200">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold uppercase">{member.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#111827] dark:text-white font-inter text-sm truncate">{member.name}</h4>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">Expires: {new Date(member.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <button className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-medium rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200">Renew</button>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] text-center py-4">No members expiring soon</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E5E5] dark:border-[#333333] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#111827] dark:text-white font-bricolage">Recent Activity</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">Latest updates from your gym</p>
            </div>
          </div>

          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <img src={activity.avatar} alt={activity.user} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#374151] dark:text-[#D1D5DB] font-inter">
                    <span className="font-semibold text-[#111827] dark:text-white">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
