const { Payment, Member, Plan } = require('../models');

// Create Payment & Update Member Expiry
exports.createPayment = async (req, res) => {
    try {
        const { memberId, amount, planId, method, durationDays } = req.body;

        // 1. Validate Input
        if (!memberId || !amount) {
            return res.status(400).json({ message: "Member ID and Amount are required" });
        }

        const member = await Member.findById(memberId);
        if (!member) return res.status(404).json({ message: "Member not found" });

        // 2. Determine Duration
        let duration = durationDays ? parseInt(durationDays) : 30; // Default 30
        let planName = 'Custom';

        if (planId) {
            const plan = await Plan.findById(planId);
            if (plan) {
                duration = plan.duration;
                planName = plan.name;
            }
        }

        // 3. Create Payment Record
        const payment = new Payment({
            memberId,
            amount,
            plan: planName,
            method: method || 'Cash',
            date: new Date()
        });
        await payment.save();

        // 4. Update Member Status & Expiry
        const currentExpiry = member.expiryDate && new Date(member.expiryDate) > new Date()
            ? new Date(member.expiryDate)
            : new Date(); // If expired or null, start from now
        
        const newExpiry = new Date(currentExpiry);
        newExpiry.setDate(newExpiry.getDate() + duration);

        member.status = 'Active';
        member.expiryDate = newExpiry;
        member.lastCheckIn = member.lastCheckIn; // Keep existing
        // update plan name if we want to track current plan on member? 
        // Schema doesn't have plan field on member explicitly in index.js but we can add or ignore for now.
        
        await member.save();

        res.status(201).json({
            payment,
            member: {
                id: member._id,
                name: member.name,
                status: member.status,
                expiryDate: member.expiryDate
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Get Payment History
exports.getPayments = async (req, res) => {
    try {
        const { memberId } = req.query;
        let query = {};
        if (memberId) query.memberId = memberId;

        const payments = await Payment.find(query).populate('memberId', 'name').sort({ date: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
