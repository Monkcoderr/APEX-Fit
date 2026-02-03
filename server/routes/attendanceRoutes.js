const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/checkin', attendanceController.checkIn);
router.get('/', attendanceController.getAttendance);

module.exports = router;
