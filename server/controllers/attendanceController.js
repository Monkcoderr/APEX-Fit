const { Attendance, Member } = require('../models');

exports.checkIn = async (req, res) => {
    try {
        const { memberId, phone } = req.body;
        
        // Find member by ID or Phone
        let member;
        if (memberId) {
            member = await Member.findById(memberId);
        } else if (phone) {
            member = await Member.findOne({ phone });
        }

        if (!member) {
            return res.status(404).json({ success: false, message: "Member not found" });
        }

        // Check Status
        if (member.status !== 'Active') {
            return res.status(403).json({ 
                success: false, 
                message: `Check-in Denied: Member is ${member.status}`,
                member: { name: member.name, status: member.status }
            });
        }

        // Check Expiry (Double check even if status says active)
        if (member.expiryDate && new Date(member.expiryDate) < new Date()) {
            member.status = 'Expired'; // Auto update
            await member.save();
            return res.status(403).json({ 
                success: false, 
                message: "Check-in Denied: Membership Expired",
                member: { name: member.name, status: 'Expired', expiryDate: member.expiryDate }
            });
        }

        // Check if already checked in today (optional, but good for data hygiene)
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        const endOfDay = new Date();
        endOfDay.setHours(23,59,59,999);

        const existingCheckIn = await Attendance.findOne({
             memberId: member._id,
             date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (existingCheckIn) {
            return res.json({ 
                success: true, 
                message: "Already checked in today", 
                member: { name: member.name, lastCheckIn: existingCheckIn.date } 
            });
        }

        // Create Attendance
        const attendance = new Attendance({
            memberId: member._id,
            status: 'Present',
            date: new Date()
        });
        await attendance.save();

        // Update Member last checkin
        member.lastCheckIn = new Date();
        await member.save();

        res.status(201).json({ 
            success: true, 
            message: "Check-in Successful", 
            attendance,
            member: { name: member.name, status: member.status, expiryDays: Math.ceil((new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { memberId } = req.query;
        let query = {};
        if (memberId) query.memberId = memberId;
        
        const history = await Attendance.find(query).populate('memberId', 'name').sort({ date: -1 }).limit(50);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
