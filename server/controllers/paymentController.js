const { Payment, Member, Plan } = require('../models');

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('memberId', 'name phone').sort({ date: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const { memberId, planName, amount, method, duration } = req.body; // duration in days

        if (!memberId || !amount) {
            return res.status(400).json({ message: "Member ID and Amount are required" });
        }

        // 1. Create Payment Record
        const payment = new Payment({
            memberId,
            amount,
            plan: planName,
            method,
            date: new Date()
        });
        await payment.save();

        // 2. Update Member Expiry
        const member = await Member.findById(memberId);
        if (member) {
            let newExpiry = new Date();
            // If currently active and not expired, extend from existing expiry
            if (member.status === 'Active' && member.expiryDate > new Date()) {
                newExpiry = new Date(member.expiryDate);
            }
            
            // Add days
            const daysToAdd = duration || 30; // Default 30 if not provided
            newExpiry.setDate(newExpiry.getDate() + parseInt(daysToAdd));

            member.expiryDate = newExpiry;
            member.status = 'Active'; // Reactivate if expired
            await member.save();
        }

        res.status(201).json({ payment, member });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
