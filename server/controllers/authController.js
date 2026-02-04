const { Admin } = require('../models');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Find admin
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await admin.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Send response
        res.json({
            _id: admin._id,
            username: admin.username,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id)
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select('-password');
        
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.json(admin);
    } catch (err) {
        console.error('Get me error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Admin logout (client-side primarily)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        // In a more advanced setup, you could blacklist the token here
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Server error during logout' });
    }
};
