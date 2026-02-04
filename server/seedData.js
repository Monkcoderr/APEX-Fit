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

        // Create Payments for members with historical data for analytics
        const payments = [];
        
        // Helper function to generate random date in a given month offset
        const getRandomDateInMonth = (monthsAgo) => {
            const date = new Date();
            date.setMonth(date.getMonth() - monthsAgo);
            const randomDay = Math.floor(Math.random() * 28) + 1; // Safe day range
            date.setDate(randomDay);
            return date;
        };

        // Generate payments for the last 6 months for revenue analytics
        const paymentMethods = ['Cash', 'Card', 'Online'];
        const planTypes = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly'];
        const planPrices = {
            'Monthly': 1500,
            'Quarterly': 4000,
            'Half Yearly': 7500,
            'Yearly': 14000
        };

        // Current month payments (15-20 payments)
        for (let i = 0; i < 18; i++) {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            const randomPlan = planTypes[Math.floor(Math.random() * planTypes.length)];
            const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            payments.push({
                memberId: randomMember._id,
                amount: planPrices[randomPlan],
                plan: randomPlan,
                method: randomMethod,
                date: getRandomDateInMonth(0)
            });
        }

        // Last month payments (12-15 payments)
        for (let i = 0; i < 14; i++) {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            const randomPlan = planTypes[Math.floor(Math.random() * planTypes.length)];
            const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            payments.push({
                memberId: randomMember._id,
                amount: planPrices[randomPlan],
                plan: randomPlan,
                method: randomMethod,
                date: getRandomDateInMonth(1)
            });
        }

        // 2 months ago (10-12 payments)
        for (let i = 0; i < 11; i++) {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            const randomPlan = planTypes[Math.floor(Math.random() * planTypes.length)];
            const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            payments.push({
                memberId: randomMember._id,
                amount: planPrices[randomPlan],
                plan: randomPlan,
                method: randomMethod,
                date: getRandomDateInMonth(2)
            });
        }

        // 3 months ago (8-10 payments)
        for (let i = 0; i < 9; i++) {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            const randomPlan = planTypes[Math.floor(Math.random() * planTypes.length)];
            const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            payments.push({
                memberId: randomMember._id,
                amount: planPrices[randomPlan],
                plan: randomPlan,
                method: randomMethod,
                date: getRandomDateInMonth(3)
            });
        }

        // 4 months ago (7-9 payments)
        for (let i = 0; i < 8; i++) {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            const randomPlan = planTypes[Math.floor(Math.random() * planTypes.length)];
            const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            payments.push({
                memberId: randomMember._id,
                amount: planPrices[randomPlan],
                plan: randomPlan,
                method: randomMethod,
                date: getRandomDateInMonth(4)
            });
        }

        // 5 months ago (6-8 payments)
        for (let i = 0; i < 7; i++) {
            const randomMember = members[Math.floor(Math.random() * members.length)];
            const randomPlan = planTypes[Math.floor(Math.random() * planTypes.length)];
            const randomMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
            
            payments.push({
                memberId: randomMember._id,
                amount: planPrices[randomPlan],
                plan: randomPlan,
                method: randomMethod,
                date: getRandomDateInMonth(5)
            });
        }

        await Payment.insertMany(payments);
        console.log(`✅ Created ${payments.length} payments across 6 months`);

        // Calculate total revenue
        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
        console.log(`💰 Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}`);

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
