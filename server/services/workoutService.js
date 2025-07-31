const workoutDal = require('../dal/workoutDal');

class WorkoutService {
  // Get all workouts
  async getAllWorkouts() {
    try {
      return await workoutDal.getAllWorkouts();
    } catch (error) {
      throw error;
    }
  }

  // Get workout by ID
  async getWorkoutById(id) {
    try {
      return await workoutDal.getWorkoutById(id);
    } catch (error) {
      throw error;
    }
  }

  // Create new workout
  async createWorkout(workoutData) {
    try {
      // Validate workout data
      this.validateWorkoutData(workoutData);
      
      // Set default values
      const workout = {
        ...workoutData,
        date: workoutData.date || new Date(),
        completed: workoutData.completed || false
      };

      return await workoutDal.createWorkout(workout);
    } catch (error) {
      throw error;
    }
  }

  // Update workout
  async updateWorkout(id, updateData) {
    try {
      // Validate update data
      if (updateData.exercises) {
        this.validateExercises(updateData.exercises);
      }

      return await workoutDal.updateWorkout(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  // Delete workout
  async deleteWorkout(id) {
    try {
      return await workoutDal.deleteWorkout(id);
    } catch (error) {
      throw error;
    }
  }

  // Get workouts by date range
  async getWorkoutsByDateRange(startDate, endDate) {
    try {
      return await workoutDal.getWorkoutsByDateRange(startDate, endDate);
    } catch (error) {
      throw error;
    }
  }

  // Get workout statistics
  async getWorkoutStats() {
    try {
      return await workoutDal.getWorkoutStats();
    } catch (error) {
      throw error;
    }
  }

  // Validate workout data
  validateWorkoutData(workoutData) {
    if (workoutData.exercises && workoutData.exercises.length > 0) {
      this.validateExercises(workoutData.exercises);
    }

    if (workoutData.duration && workoutData.duration < 0) {
      throw new Error('Duration cannot be negative');
    }
  }

  // Validate exercises
  validateExercises(exercises) {
    exercises.forEach((exercise, index) => {
      if (!exercise.name || exercise.name.trim().length === 0) {
        throw new Error(`Exercise ${index + 1} name is required`);
      }

      if (!exercise.sets || exercise.sets.length === 0) {
        throw new Error(`Exercise ${exercise.name} must have at least one set`);
      }

      exercise.sets.forEach((set, setIndex) => {
        if (set.weight < 0) {
          throw new Error(`Set ${setIndex + 1} in ${exercise.name} cannot have negative weight`);
        }

        if (set.reps < 1) {
          throw new Error(`Set ${setIndex + 1} in ${exercise.name} must have at least 1 rep`);
        }
      });
    });
  }

  // Calculate workout statistics
  calculateWorkoutStats(workout) {
    const stats = {
      totalSets: 0,
      totalReps: 0,
      totalWeight: 0,
      totalVolume: 0,
      exerciseCount: workout.exercises.length
    };

    workout.exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        stats.totalSets++;
        stats.totalReps += set.reps;
        stats.totalWeight += set.weight;
        stats.totalVolume += set.weight * set.reps;
      });
    });

    return stats;
  }

  // Get total weight lifted
  async getTotalWeightLifted() {
    try {
      return await workoutDal.getTotalWeightLifted();
    } catch (error) {
      throw error;
    }
  }

  // Get total weight by muscle group
  async getWeightByMuscleGroup() {
    try {
      return await workoutDal.getWeightByMuscleGroup();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new WorkoutService(); 