const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    notes: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', 'Expired'], default: 'Active' },
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

const Member = mongoose.model('Member', memberSchema);
const Plan = mongoose.model('Plan', planSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const User = mongoose.model('User', userSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Import Admin model separately to avoid circular dependency
const Admin = require('./Admin');

module.exports = {
    Member,
    Plan,
    Payment,
    User,
    Attendance,
    Admin
};
