const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const measurementController = require('../controllers/measurementController');

// Apply auth middleware to all routes
router.use(auth);

// Get all measurements for the authenticated user
router.get('/', measurementController.getMeasurements);

// Add new measurement
router.post('/', measurementController.addMeasurement);

// Get user's measurement goals
router.get('/goals', measurementController.getGoals);

// Update user's measurement goals
router.put('/goals', measurementController.updateGoals);

module.exports = router; 