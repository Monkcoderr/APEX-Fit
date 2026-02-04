const { Member } = require('../models');

// Get all members
exports.getMembers = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } }
                ]
            };
        }
        const members = await Member.find(query).sort({ createdAt: -1 });
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create member
exports.createMember = async (req, res) => {
    try {
        const { name, phone, notes } = req.body;
        if (!name || !phone) return res.status(400).json({ message: "Name and Phone required" });

        const existing = await Member.findOne({ phone });
        if (existing) return res.status(400).json({ message: "Member with this phone already exists" });

        // Initial status inactive until payment
        const newMember = new Member({
            name,
            phone,
            notes,
            status: 'Inactive', 
            // expiryDate not set or set to null until payment
        });

        await newMember.save();
        res.status(201).json(newMember);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single member details
exports.getMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update member
exports.updateMember = async (req, res) => {
    try {
        const { name, phone, notes, status, expiryDate } = req.body;
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });

        member.name = name || member.name;
        member.phone = phone || member.phone;
        member.notes = notes || member.notes;
        if (status) member.status = status;
        if (expiryDate) member.expiryDate = expiryDate;

        await member.save();
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete member
exports.deleteMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        
        await member.deleteOne();
        res.json({ message: "Member removed" });
    } catch (err) {
         res.status(500).json({ message: err.message });
    }
};
