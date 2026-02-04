const { Member, Payment, Attendance } = require('../models');

exports.getStats = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        // 1. Total Revenue (This Month)
        // Aggregate all payments where date >= startOfMonth
        const revenueAggregation = await Payment.aggregate([
            { $match: { date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

        // 2. Member Counts
        const totalActive = await Member.countDocuments({ status: 'Active' });
        const totalExpired = await Member.countDocuments({ status: 'Expired' });

        // 3. Today's Check-ins
        const todayCheckIns = await Attendance.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        // 4. Expiring in 7 Days
        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);
        
        const expiringMembers = await Member.find({
            status: 'Active',
            expiryDate: { $gte: new Date(), $lte: next7Days }
        }).select('name phone expiryDate plan');

        // 5. Recent Activity (Mocked mixed with real data usually, but let's try real last 5 attendances)
        // For simplicity in MVP, we might return just stats first.
        
        // 6. Chart Data (Last 6 Months Revenue) - Optional Complex Aggregation
        // Leaving out for speed unless requested, or returning mock for now to match UI 
        const chartData = [
            { month: "Jan", revenue: 0, members: 0 }, 
            // ... (ideally aggregated from DB)
        ];

        res.json({
            revenue: totalRevenue,
            activeMembers: totalActive,
            expiredMembers: totalExpired,
            todayCheckIns: todayCheckIns,
            expiringSoon: expiringMembers,
            // chartData: chartData // Front end can use mock for now or we build this later
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};
