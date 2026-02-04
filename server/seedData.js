const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Member, Plan, Payment, Admin } = require('./models');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitflow_pro');
        console.log('MongoDB Connected');

        // Clear existing data (optional - comment out if you want to keep existing data)
        await Member.deleteMany({});
        await Plan.deleteMany({});
        await Payment.deleteMany({});
        console.log('Cleared existing data');

        // Create Plans
        const plans = await Plan.insertMany([
            {
                name: 'Monthly',
                duration: 30,
                price: 1500,
                description: 'Access to gym for 30 days'
            },
            {
                name: 'Quarterly',
                duration: 90,
                price: 4000,
                description: 'Access to gym for 3 months - Save 11%'
            },
            {
                name: 'Half Yearly',
                duration: 180,
                price: 7500,
                description: 'Access to gym for 6 months - Save 17%'
            },
            {
                name: 'Yearly',
                duration: 365,
                price: 14000,
                description: 'Access to gym for 1 year - Save 22%'
            }
        ]);
        console.log(`✅ Created ${plans.length} plans`);

        // Create Members
        const members = await Member.insertMany([
            {
                name: 'Rahul Sharma',
                phone: '+91-9876543210',
                status: 'Active',
                expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                lastCheckIn: new Date(),
                notes: 'Regular member, prefers morning workouts'
            },
            {
                name: 'Priya Patel',
                phone: '+91-9876543211',
                status: 'Active',
                expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
                lastCheckIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
                notes: 'Interested in yoga classes'
            },
            {
                name: 'Amit Kumar',
                phone: '+91-9876543212',
                status: 'Active',
                expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now (expiring soon)
                lastCheckIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                notes: 'Needs renewal reminder'
            },
            {
                name: 'Sneha Reddy',
                phone: '+91-9876543213',
                status: 'Expired',
                expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                lastCheckIn: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                notes: 'Membership expired, follow up needed'
            },
            {
                name: 'Vikram Singh',
                phone: '+91-9876543214',
                status: 'Active',
                expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
                lastCheckIn: new Date(),
                notes: 'Personal training client'
            },
            {
                name: 'Anjali Mehta',
                phone: '+91-9876543215',
                status: 'Active',
                expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
                lastCheckIn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                notes: 'Prefers evening sessions'
            },
            {
                name: 'Rohan Gupta',
                phone: '+91-9876543216',
                status: 'Inactive',
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                lastCheckIn: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                notes: 'On medical leave'
            },
            {
                name: 'Kavya Iyer',
                phone: '+91-9876543217',
                status: 'Active',
                expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now (expiring soon)
                lastCheckIn: new Date(),
                notes: 'Interested in group classes'
            },
            {
                name: 'Arjun Nair',
                phone: '+91-9876543218',
                status: 'Active',
                expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                lastCheckIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                notes: 'Strength training focus'
            },
            {
                name: 'Divya Krishnan',
                phone: '+91-9876543219',
                status: 'Expired',
                expiryDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                lastCheckIn: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
                notes: 'Former member, potential renewal'
            }
        ]);
        console.log(`✅ Created ${members.length} members`);

        // Create Payments for some members
        const payments = [];
        
        // Rahul - Monthly plan
        payments.push({
            memberId: members[0]._id,
            amount: 1500,
            plan: 'Monthly',
            method: 'Card',
            date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        });

        // Priya - Quarterly plan
        payments.push({
            memberId: members[1]._id,
            amount: 4000,
            plan: 'Quarterly',
            method: 'Online',
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        });

        // Amit - Monthly plan
        payments.push({
            memberId: members[2]._id,
            amount: 1500,
            plan: 'Monthly',
            method: 'Cash',
            date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        });

        // Vikram - Half Yearly plan
        payments.push({
            memberId: members[4]._id,
            amount: 7500,
            plan: 'Half Yearly',
            method: 'Card',
            date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        });

        // Anjali - Quarterly plan
        payments.push({
            memberId: members[5]._id,
            amount: 4000,
            plan: 'Quarterly',
            method: 'Online',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        });

        // Arjun - Quarterly plan
        payments.push({
            memberId: members[8]._id,
            amount: 4000,
            plan: 'Quarterly',
            method: 'Cash',
            date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        });

        await Payment.insertMany(payments);
        console.log(`✅ Created ${payments.length} payments`);

        // Create default admin if not exists
        const existingAdmin = await Admin.findOne({ email: 'admin@apexfit.com' });
        
        if (!existingAdmin) {
            await Admin.create({
                username: 'admin',
                email: 'admin@apexfit.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('✅ Created default admin');
        } else {
            console.log('ℹ️  Admin already exists');
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - ${plans.length} membership plans`);
        console.log(`   - ${members.length} members`);
        console.log(`   - ${payments.length} payment records`);
        console.log(`   - 1 admin account`);
        console.log('\n🔐 Login credentials:');
        console.log('   Email: admin@apexfit.com');
        console.log('   Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
