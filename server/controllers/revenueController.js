const { Payment } = require('../models');

// @desc    Get revenue analytics
// @route   GET /api/dashboard/revenue-analytics
// @access  Private
exports.getRevenueAnalytics = async (req, res) => {
    try {
        // Get payments from last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const payments = await Payment.find({
            date: { $gte: sixMonthsAgo }
        }).sort({ date: 1 });

        // Group by month
        const monthlyData = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        payments.forEach(payment => {
            const date = new Date(payment.date);
            const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {
                    month: monthNames[date.getMonth()],
                    year: date.getFullYear(),
                    revenue: 0,
                    count: 0
                };
            }
            
            monthlyData[monthKey].revenue += payment.amount;
            monthlyData[monthKey].count += 1;
        });

        // Convert to array and sort by date
        const revenueData = Object.values(monthlyData).map(item => ({
            month: item.month,
            revenue: item.revenue,
            payments: item.count
        }));

        res.json(revenueData);
    } catch (err) {
        console.error('Revenue analytics error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
