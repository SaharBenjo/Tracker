const workoutService = require('../services/workoutService');

class WorkoutController {
  // Get all workouts
  async getAllWorkouts(req, res) {
    try {
      const workouts = await workoutService.getAllWorkouts();
      res.json({
        success: true,
        data: workouts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get workout by ID
  async getWorkoutById(req, res) {
    try {
      const { id } = req.params;
      const workout = await workoutService.getWorkoutById(id);
      res.json({
        success: true,
        data: workout
      });
    } catch (error) {
      if (error.message === 'Workout not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  }

  // Create new workout
  async createWorkout(req, res) {
    try {
      const workoutData = req.body;
      const workout = await workoutService.createWorkout(workoutData);
      res.status(201).json({
        success: true,
        data: workout
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update workout
  async updateWorkout(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const workout = await workoutService.updateWorkout(id, updateData);
      res.json({
        success: true,
        data: workout
      });
    } catch (error) {
      if (error.message === 'Workout not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: error.message
        });
      }
    }
  }

  // Delete workout
  async deleteWorkout(req, res) {
    try {
      const { id } = req.params;
      await workoutService.deleteWorkout(id);
      res.json({
        success: true,
        message: 'Workout deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Workout not found') {
        res.status(404).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  }

  // Get workouts by date range
  async getWorkoutsByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required'
        });
      }

      const workouts = await workoutService.getWorkoutsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
      
      res.json({
        success: true,
        data: workouts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get workout statistics
  async getWorkoutStats(req, res) {
    try {
      const stats = await workoutService.getWorkoutStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get total weight lifted
  async getTotalWeightLifted(req, res) {
    try {
      const totalWeight = await workoutService.getTotalWeightLifted();
      res.json({
        success: true,
        totalWeightLifted: totalWeight
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get total weight by muscle group
  async getWeightByMuscleGroup(req, res) {
    try {
      const breakdown = await workoutService.getWeightByMuscleGroup();
      res.json({
        success: true,
        breakdown
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new WorkoutController(); 