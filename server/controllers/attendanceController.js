const { Member, Attendance } = require('../models');

exports.checkIn = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: "Phone number required" });

        const member = await Member.findOne({ phone });
        if (!member) return res.status(404).json({ message: "Member not found" });

        // Check Expiry
        const now = new Date();
        if (member.expiryDate && member.expiryDate < now) {
            member.status = 'Expired';
            await member.save();
            return res.status(400).json({ message: "Membership Expired", member });
        }

        // Record Attendance
        const attendance = new Attendance({
            memberId: member._id,
            status: 'Present'
        });
        await attendance.save();

        // Update Member Last Check-in
        member.lastCheckIn = now;
        await member.save();

        res.json({ message: "Check-in Successful", member });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const logs = await Attendance.find().populate('memberId', 'name phone').sort({ date: -1 }).limit(50);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
