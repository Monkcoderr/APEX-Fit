import { useState, useRef, useEffect } from "react";
import { Search, CheckCircle, XCircle, Clock, User, AlertTriangle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function CheckInPage() {
    const [search, setSearch] = useState("");
    const [lastCheckIn, setLastCheckIn] = useState(null);
    const inputRef = useRef(null);

    // Auto-focus input for barcode scanners
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const checkInMutation = useMutation({
        mutationFn: async (phone) => {
            // Mock API call to check-in by phone
            const res = await fetch('http://localhost:5000/api/attendance/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });
            const data = await res.json();
            if (!res.ok && !data.member) { // If error but we have member info (e.g. expired), we still want to show it
                throw new Error(data.message || 'Check-in failed');
            }
            return data;
        },
        onSuccess: (data) => {
            setLastCheckIn({ ...data, timestamp: new Date() });
            setSearch("");
            // Play success sound?
        },
        onError: (error) => {
            // Handle weird errors where we didn't get member info back
            setLastCheckIn({ success: false, message: error.message, timestamp: new Date() });
            setSearch("");
        }
    });

    // Handle errors that return member data (e.g. Expired)
    const handleCheckIn = async (e) => {
        e.preventDefault();
        if (!search.trim()) return;

        try {
            const res = await fetch('http://localhost:5000/api/attendance/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: search })
            });
            const data = await res.json();
            setLastCheckIn({ ...data, timestamp: new Date() });
            setSearch("");
        } catch (err) {
            setLastCheckIn({ success: false, message: "Network Error", timestamp: new Date() });
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-[#111827] dark:text-white font-sora">
                    Member Check-In
                </h1>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter">
                    Enter phone number or scan member ID
                </p>
            </div>

            {/* Check-in Input Card */}
            <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-lg border border-[#E5E5E5] dark:border-[#333333]">
                <form onSubmit={handleCheckIn} className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-6 h-6" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search member by phone..."
                            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-[#E5E5E5] dark:border-[#333333] rounded-xl bg-[#F9FAFB] dark:bg-[#262626] text-[#111827] dark:text-white focus:border-[#2563EB] focus:ring-0 outline-none transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-8 py-4 bg-[#2563EB] text-white text-lg font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors shadow-md"
                    >
                        Check In
                    </button>
                </form>
            </div>

            {/* Result Display */}
            {lastCheckIn && (
                <div className={`transform transition-all duration-300 ${lastCheckIn.success ? 'scale-100 opacity-100' : 'scale-100 opacity-100'}`}>
                    <div className={`rounded-2xl p-8 border-2 text-center space-y-4 shadow-xl ${lastCheckIn.success
                            ? "bg-green-50 dark:bg-green-900/10 border-green-500"
                            : "bg-red-50 dark:bg-red-900/10 border-red-500"
                        }`}>
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${lastCheckIn.success ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}>
                            {lastCheckIn.success ? <CheckCircle size={40} /> : <XCircle size={40} />}
                        </div>

                        <div>
                            <h2 className={`text-2xl font-bold font-sora ${lastCheckIn.success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                                }`}>
                                {lastCheckIn.success ? "Check-in Successful" : "Check-in Denied"}
                            </h2>
                            <p className="text-[#6B7280] dark:text-[#9CA3AF] font-inter mt-1">
                                {lastCheckIn.message}
                            </p>
                        </div>

                        {lastCheckIn.member && (
                            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 max-w-sm mx-auto shadow-sm border border-black/5 dark:border-white/5">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-[#374151] rounded-full flex items-center justify-center">
                                        <User size={24} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#111827] dark:text-white font-inter">
                                            {lastCheckIn.member.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lastCheckIn.member.status === 'Active'
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {lastCheckIn.member.status}
                                            </span>
                                            {lastCheckIn.member.expiryDays !== undefined && (
                                                <span className="text-[#6B7280] dark:text-[#9CA3AF]">
                                                    {lastCheckIn.member.expiryDays} days left
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
