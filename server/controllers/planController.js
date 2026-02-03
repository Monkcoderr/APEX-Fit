const { Plan } = require('../models');

exports.getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPlan = async (req, res) => {
    try {
        const { name, duration, price, description } = req.body;
        const newPlan = new Plan({ name, duration, price, description });
        await newPlan.save();
        res.status(201).json(newPlan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
