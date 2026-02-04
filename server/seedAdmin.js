const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Admin } = require('./models');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitflow_pro');
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@apexfit.com' });
        
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        // Create default admin
        const admin = await Admin.create({
            username: 'admin',
            email: 'admin@apexfit.com',
            password: 'admin123', // Will be hashed by pre-save hook
            role: 'admin'
        });

        console.log('Default admin created successfully:');
        console.log('Email: admin@apexfit.com');
        console.log('Password: admin123');
        console.log('\n⚠️  IMPORTANT: Please change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
