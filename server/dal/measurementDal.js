const mongoose = require('mongoose');

// Measurement Schema
const measurementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['waist', 'chest', 'arms', 'thighs'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Measurement Goals Schema
const measurementGoalsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  waist: {
    type: Number,
    default: null
  },
  chest: {
    type: Number,
    default: null
  },
  arms: {
    type: Number,
    default: null
  },
  thighs: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

const Measurement = mongoose.model('Measurement', measurementSchema);
const MeasurementGoals = mongoose.model('MeasurementGoals', measurementGoalsSchema);

// Get all measurements for a user
const getMeasurements = async (userId) => {
  try {
    const measurements = await Measurement.find({ userId })
      .sort({ date: -1 })
      .lean();
    return measurements;
  } catch (error) {
    console.error('Error in getMeasurements:', error);
    throw error;
  }
};

// Add new measurement
const addMeasurement = async (measurementData) => {
  try {
    console.log('DAL: Received measurement data:', measurementData);
    const measurement = new Measurement(measurementData);
    console.log('DAL: Created measurement object:', measurement);
    const savedMeasurement = await measurement.save();
    console.log('DAL: Saved measurement:', savedMeasurement);
    return savedMeasurement.toObject();
  } catch (error) {
    console.error('Error in addMeasurement:', error);
    throw error;
  }
};

// Get user's measurement goals
const getGoals = async (userId) => {
  try {
    const goals = await MeasurementGoals.findOne({ userId }).lean();
    return goals || {};
  } catch (error) {
    console.error('Error in getGoals:', error);
    throw error;
  }
};

// Update user's measurement goals
const updateGoals = async (userId, goals) => {
  try {
    const updatedGoals = await MeasurementGoals.findOneAndUpdate(
      { userId },
      goals,
      { new: true, upsert: true }
    ).lean();
    
    return updatedGoals;
  } catch (error) {
    console.error('Error in updateGoals:', error);
    throw error;
  }
};

module.exports = {
  getMeasurements,
  addMeasurement,
  getGoals,
  updateGoals
}; 