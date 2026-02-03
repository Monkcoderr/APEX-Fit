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
        const { name, phone, plan, notes } = req.body;
        // Basic validation
        if (!name || !phone) return res.status(400).json({ message: "Name and Phone required" });

        const existing = await Member.findOne({ phone });
        if (existing) return res.status(400).json({ message: "Member with this phone already exists" });

        // Calculate initial expiry based on plan (mock logic for now if Plan model not queried)
        // In real app, fetch plan duration. Defaulting to 30 days if not handled in Payment.
        // Actually, creating a member might not set expiry until payment. 
        // Let's set status to Active and expiry 30 days from now for MVP simplicity or 'Pending'
        
        const newMember = new Member({
            name,
            phone,
            notes,
            status: 'Active',
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days trail/start
        });

        await newMember.save();
        res.status(201).json(newMember);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single member
exports.getMember = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: "Member not found" });
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
