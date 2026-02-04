import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AddMemberModal from "./AddMemberModal";
import RecordPaymentModal from "./RecordPaymentModal";
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
} from "lucide-react";

export default function MembersManager() {
  console.log("🏋️ MembersManager: Component function called");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or table
  const [selectedMember, setSelectedMember] = useState(null);

  console.log("🏋️ MembersManager: State initialized");
  console.log("🏋️ MembersManager: isAddModalOpen =", isAddModalOpen);

  // Fetch Members
  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/members', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const membersData = members;

  // Track modal state changes
  useEffect(() => {
    console.log("🔄 MembersManager: isAddModalOpen changed to:", isAddModalOpen);
  }, [isAddModalOpen]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-400",
        icon: CheckCircle,
      },
      inactive: {
        bg: "bg-gray-100 dark:bg-gray-900/30",
        text: "text-gray-800 dark:text-gray-400",
        icon: Clock,
      },
      expired: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-400",
        icon: XCircle,
      },
    };

    const normalizedStatus = status?.toLowerCase() || 'active';
    const config = statusConfig[normalizedStatus] || statusConfig.active;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon size={12} />
        {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Active'}
      </div>
    );
  };

  const getPlanBadge = (plan) => {
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${plan === "Premium"
          ? "bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          }`}
      >
        {plan}
      </div>
    );
  };

  const filteredMembers = membersData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddMember = () => {
    console.log("=== ADD MEMBER BUTTON CLICKED ===");
    console.log("Setting isAddModalOpen to true");
    setIsAddModalOpen(true);
  };

  const handleRecordPayment = (member) => {
    setSelectedMember(member);
    setIsPaymentModalOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    console.log("Edit member:", member);
  };

  const handleDeleteMember = (memberId) => {
    console.log("Delete member:", memberId);
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    console.log("View member details:", member);
  };


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 relative z-0">
      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#2B2B2B] dark:text-white font-sora">
            Members
          </h1>
          <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF] font-inter mt-1">
            Manage your gym members and memberships
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-50">
          <button
            onClick={() => console.log("Export members")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] rounded-xl font-inter text-sm text-[#374151] dark:text-[#D1D5DB] hover:border-[#D0D0D0] dark:hover:border-[#444444] transition-colors duration-200"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleAddMember}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#10B981] text-white font-semibold text-sm rounded-xl transition-all duration-150 hover:from-[#1D4ED8] hover:to-[#059669] active:scale-95 font-inter shadow-sm"
          >
            <Plus size={16} />
            Add Member
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E5E5] dark:border-[#333333] p-4 md:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
            />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#374151] dark:text-[#D1D5DB] placeholder-[#9CA3AF] dark:placeholder-[#6B7280] font-inter text-sm focus:border-[#2563EB] dark:focus:border-[#10B981] focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-[#E5E5E5] dark:border-[#333333] rounded-lg bg-white dark:bg-[#262626] text-[#374151] dark:text-[#D1D5DB] font-inter text-sm focus:border-[#2563EB] dark:focus:border-[#10B981] focus:outline-none transition-colors duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F3F4F6] dark:bg-[#374151] rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${viewMode === "grid"
                ? "bg-white dark:bg-[#1E1E1E] text-[#2563EB] shadow-sm"
                : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#374151] dark:hover:text-[#D1D5DB]"
                }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 ${viewMode === "table"
                ? "bg-white dark:bg-[#1E1E1E] text-[#2563EB] shadow-sm"
                : "text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#374151] dark:hover:text-[#D1D5DB]"
                }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Members Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E5E5] dark:border-[#333333] p-6 hover:border-[#2563EB] dark:hover:border-[#10B981] transition-all duration-200 hover:shadow-lg group"
            >
              {/* Member Avatar and Actions */}
              <div className="flex items-start justify-between mb-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="relative">
                  <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] dark:hover:bg-[#374151] transition-colors duration-200 opacity-0 group-hover:opacity-100">
                    <MoreHorizontal
                      size={16}
                      className="text-[#6B7280] dark:text-[#9CA3AF]"
                    />
                  </button>
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-[#111827] dark:text-white font-inter">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                    {member.email}
                  </p>
                </div>

                {/* Status and Plan */}
                <div className="flex items-center justify-between">
                  {getStatusBadge(member.status)}
                  {getPlanBadge(member.plan)}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#E5E5E5] dark:border-[#333333]">
                  <div>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                      Check-ins
                    </span>
                    <div className="text-lg font-semibold text-[#111827] dark:text-white font-sora">
                      {member.checkins}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                      Trainer
                    </span>
                    <div className="text-sm font-medium text-[#111827] dark:text-white font-inter truncate">
                      {member.trainer}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3">
                  <button
                    onClick={() => handleViewMember(member)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#F3F4F6] dark:bg-[#374151] text-[#374151] dark:text-[#D1D5DB] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#4B5563] transition-colors duration-200 text-xs font-medium"
                  >
                    <Eye size={12} />
                    View
                  </button>
                  <button
                    onClick={() => handleEditMember(member)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors duration-200 text-xs font-medium"
                  >
                    <Edit3 size={12} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E5E5] dark:border-[#333333] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] dark:bg-[#374151] border-b border-[#E5E5E5] dark:border-[#4B5563]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider font-inter">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider font-inter">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider font-inter">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider font-inter">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider font-inter">
                    Check-ins
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider font-inter">
                    Last Visit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider font-inter">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5] dark:divide-[#333333]">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-[#F9FAFB] dark:hover:bg-[#374151] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-[#111827] dark:text-white font-inter">
                            {member.name}
                          </div>
                          <div className="text-xs text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                            Trainer: {member.trainer}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-[#374151] dark:text-[#D1D5DB] font-inter">
                          <Mail size={12} />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                          <Phone size={12} />
                          {member.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlanBadge(member.plan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#111827] dark:text-white font-sora">
                      {member.checkins}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                      {new Date(member.lastVisit).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewMember(member)}
                          className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors duration-200"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleEditMember(member)}
                          className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors duration-200"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleRecordPayment(member)}
                          className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#10B981] transition-colors duration-200"
                          title="Record Payment"
                        >
                          <CreditCard size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="p-1.5 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#EF4444] transition-colors duration-200"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredMembers.length === 0 && (
        <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E5E5E5] dark:border-[#333333] p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-[#F3F4F6] dark:bg-[#374151] rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-[#6B7280] dark:text-[#9CA3AF]" />
            </div>
            <h3 className="text-lg font-medium text-[#111827] dark:text-white font-inter mb-2">
              No members found
            </h3>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter mb-4">
              {searchTerm || selectedFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first gym member"}
            </p>
            {!searchTerm && selectedFilter === "all" && (
              <button
                onClick={handleAddMember}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB] text-white font-medium text-sm rounded-xl hover:bg-[#1D4ED8] transition-colors duration-200"
              >
                <Plus size={16} />
                Add First Member
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
