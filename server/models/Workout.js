const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  muscleGroup: {
    type: String,
    required: true,
    trim: true
  },
  sets: [{
    weight: {
      type: Number,
      required: true,
      min: 0
    },
    reps: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  notes: {
    type: String,
    trim: true
  }
});

// Each workout contains an array of exercises, each with name, muscleGroup, sets (weight, reps, restTime), and notes.

const workoutSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    min: 0
  },
  exercises: [exerciseSchema],
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
workoutSchema.index({ date: -1 });
workoutSchema.index({ completed: 1 });

module.exports = mongoose.model('Workout', workoutSchema); 