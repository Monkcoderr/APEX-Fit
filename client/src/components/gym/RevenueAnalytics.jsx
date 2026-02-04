import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueAnalytics() {
    const [activeTab, setActiveTab] = useState('revenue');

    // Fetch revenue analytics data
    const { data: analyticsData = [], isLoading } = useQuery({
        queryKey: ['revenueAnalytics'],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/dashboard/revenue-analytics', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch analytics');
            return res.json();
        }
    });

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] rounded-xl p-3 shadow-xl">
                    <p className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-1 uppercase tracking-wider">
                        {payload[0].payload.month}
                    </p>
                    {activeTab === 'revenue' ? (
                        <p className="text-lg font-bold text-[#2563EB]">
                            ₹{payload[0].value.toLocaleString('en-IN')}
                        </p>
                    ) : (
                        <p className="text-lg font-bold text-[#10B981]">
                            {payload[0].value} payments
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] rounded-xl p-6 h-[400px]">
                <div className="animate-pulse h-full flex flex-col">
                    <div className="h-6 bg-gray-200 dark:bg-[#333333] rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-[#333333] rounded w-32 mb-8"></div>
                    <div className="flex-1 bg-gray-100 dark:bg-[#252525] rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#333333] rounded-xl p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-lg md:text-xl font-semibold text-[#111827] dark:text-white font-bricolage">
                        Revenue Analytics
                    </h3>
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] font-inter mt-1">
                        Monthly growth trends
                    </p>
                </div>

                {/* Tab Toggle */}
                <div className="flex items-center gap-1 bg-[#F3F4F6] dark:bg-[#374151] rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('revenue')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${activeTab === 'revenue'
                                ? 'bg-white dark:bg-[#1E1E1E] text-[#2563EB] shadow-sm'
                                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#374151] dark:hover:text-[#D1D5DB]'
                            }`}
                    >
                        Revenue
                    </button>
                    <button
                        onClick={() => setActiveTab('members')}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${activeTab === 'members'
                                ? 'bg-white dark:bg-[#1E1E1E] text-[#2563EB] shadow-sm'
                                : 'text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#374151] dark:hover:text-[#D1D5DB]'
                            }`}
                    >
                        Members
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="h-[280px] w-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="membersGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false} className="dark:stroke-[#333333]" />
                        <XAxis
                            dataKey="month"
                            stroke="#9CA3AF"
                            style={{ fontSize: '11px', fontFamily: 'Inter', fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            style={{ fontSize: '11px', fontFamily: 'Inter', fontWeight: 500 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                activeTab === 'revenue'
                                    ? `₹${(value / 1000).toFixed(0)}k`
                                    : value
                            }
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2563EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
                        {activeTab === 'revenue' ? (
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#2563EB"
                                strokeWidth={3}
                                fill="url(#revenueGradient)"
                                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                                animationDuration={1500}
                            />
                        ) : (
                            <Area
                                type="monotone"
                                dataKey="payments"
                                stroke="#10B981"
                                strokeWidth={3}
                                fill="url(#membersGradient)"
                                dot={{ fill: '#10B981', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                                animationDuration={1500}
                            />
                        )}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
