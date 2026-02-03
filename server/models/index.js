const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    notes: { type: String },
    status: { type: String, enum: ['Active', 'Expired'], default: 'Active' },
    expiryDate: { type: Date },
    lastCheckIn: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const planSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true }, // in days
    price: { type: Number, required: true },
    description: { type: String }
});

const paymentSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    amount: { type: Number, required: true },
    plan: { type: String }, // Snapshot of plan name
    method: { type: String, enum: ['Cash', 'Card', 'Online'] },
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], default: 'admin' }
});

const attendanceSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
});

module.exports = {
    Member: mongoose.model('Member', memberSchema),
    Plan: mongoose.model('Plan', planSchema),
    Payment: mongoose.model('Payment', paymentSchema),
    User: mongoose.model('User', userSchema),
    Attendance: mongoose.model('Attendance', attendanceSchema)
};
