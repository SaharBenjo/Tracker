const Workout = require('../models/Workout');

class WorkoutDal {
  // Get all workouts
  async getAllWorkouts() {
    try {
      return await Workout.find().sort({ date: -1 });
    } catch (error) {
      throw new Error(`Error fetching workouts: ${error.message}`);
    }
  }

  // Get workout by ID
  async getWorkoutById(id) {
    try {
      const workout = await Workout.findById(id);
      if (!workout) {
        throw new Error('Workout not found');
      }
      return workout;
    } catch (error) {
      throw new Error(`Error fetching workout: ${error.message}`);
    }
  }

  // Create new workout
  async createWorkout(workoutData) {
    try {
      const workout = new Workout(workoutData);
      return await workout.save();
    } catch (error) {
      throw new Error(`Error creating workout: ${error.message}`);
    }
  }

  // Update workout
  async updateWorkout(id, updateData) {
    try {
      const workout = await Workout.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!workout) {
        throw new Error('Workout not found');
      }
      return workout;
    } catch (error) {
      throw new Error(`Error updating workout: ${error.message}`);
    }
  }

  // Delete workout
  async deleteWorkout(id) {
    try {
      const workout = await Workout.findByIdAndDelete(id);
      if (!workout) {
        throw new Error('Workout not found');
      }
      return workout;
    } catch (error) {
      throw new Error(`Error deleting workout: ${error.message}`);
    }
  }

  // Get workouts by date range
  async getWorkoutsByDateRange(startDate, endDate) {
    try {
      return await Workout.find({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ date: -1 });
    } catch (error) {
      throw new Error(`Error fetching workouts by date range: ${error.message}`);
    }
  }

  // Get workout statistics
  async getWorkoutStats() {
    try {
      const stats = await Workout.aggregate([
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: 1 },
            totalDuration: { $sum: '$duration' },
            avgDuration: { $avg: '$duration' }
          }
        }
      ]);
      return stats[0] || {
        totalWorkouts: 0,
        totalDuration: 0,
        avgDuration: 0
      };
    } catch (error) {
      throw new Error(`Error fetching workout stats: ${error.message}`);
    }
  }

  // Get total weight lifted (sum of weight * reps for all sets in all exercises)
  async getTotalWeightLifted() {
    try {
      const result = await Workout.aggregate([
        { $unwind: "$exercises" },
        { $unwind: "$exercises.sets" },
        {
          $group: {
            _id: null,
            totalWeightLifted: {
              $sum: { $multiply: ["$exercises.sets.weight", "$exercises.sets.reps"] }
            }
          }
        }
      ]);
      return result[0]?.totalWeightLifted || 0;
    } catch (error) {
      throw new Error(`Error calculating total weight lifted: ${error.message}`);
    }
  }

  // Get total weight lifted by muscle group
  async getWeightByMuscleGroup() {
    try {
      const result = await Workout.aggregate([
        { $unwind: "$exercises" },
        { $unwind: "$exercises.sets" },
        {
          $group: {
            _id: "$exercises.muscleGroup",
            totalWeight: {
              $sum: { $multiply: ["$exercises.sets.weight", "$exercises.sets.reps"] }
            }
          }
        },
        { $project: { muscleGroup: "$_id", totalWeight: 1, _id: 0 } }
      ]);
      return result;
    } catch (error) {
      throw new Error(`Error calculating weight by muscle group: ${error.message}`);
    }
  }
}

module.exports = new WorkoutDal(); 