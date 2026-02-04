const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const revenueController = require('../controllers/revenueController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, dashboardController.getStats);
router.get('/revenue-analytics', protect, revenueController.getRevenueAnalytics);

module.exports = router;
