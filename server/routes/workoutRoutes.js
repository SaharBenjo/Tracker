const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// GET /api/workouts - Get all workouts
router.get('/', workoutController.getAllWorkouts);

// GET /api/workouts/stats - Get workout statistics
router.get('/stats', workoutController.getWorkoutStats);

// GET /api/workouts/range - Get workouts by date range
router.get('/range', workoutController.getWorkoutsByDateRange);

// GET /api/workouts/total-weight - Get total weight lifted
router.get('/total-weight', workoutController.getTotalWeightLifted);

// GET /api/workouts/breakdown-by-muscle - Get total weight by muscle group
router.get('/breakdown-by-muscle', workoutController.getWeightByMuscleGroup);

// GET /api/workouts/:id - Get workout by ID
router.get('/:id', workoutController.getWorkoutById);

// POST /api/workouts - Create new workout
router.post('/', workoutController.createWorkout);

// PUT /api/workouts/:id - Update workout
router.put('/:id', workoutController.updateWorkout);

// DELETE /api/workouts/:id - Delete workout
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router; 