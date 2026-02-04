// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.json());
// app.use(cors({ origin: "*" }));

// // Database Connection
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitflow_pro')
// .then(() => console.log('MongoDB Connected'))
// .catch(err => console.error('MongoDB Connection Error:', err));

// // Routes
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/members', require('./routes/memberRoutes'));
// app.use('/api/plans', require('./routes/planRoutes'));
// app.use('/api/payment', require('./routes/paymentRoutes'));
// app.use('/api/attendance', require('./routes/attendanceRoutes'));
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// app.get('/', (req, res) => {
//     res.send('FitFlow Pro API is running');
// });

// app.listen(PORT,'0.0.0.0', () => {
//     console.log(`Server running on port ${PORT}`);
// });


const express = require('express'); // Added this!
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Admin } = require('./models/Admin'); // Ensure this path matches your file structure

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitflow_pro')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// --- SECRET ADMIN SEED ROUTE (Temporary) ---
app.get('/run-secret-seed', async (req, res) => {
    try {
        const existingAdmin = await Admin.findOne({ email: 'admin@apexfit.com' });
        if (existingAdmin) return res.send('Admin already exists!');

        await Admin.create({
            username: 'admin',
            email: 'admin@apexfit.com',
            password: 'admin123', // Your Admin model should have a pre-save hook to hash this
            role: 'admin'
        });
        res.send('Success! Admin created in the cloud.');
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});
// ------------------------------------------

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => {
    res.send('FitFlow Pro API is running');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
