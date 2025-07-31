const measurementDal = require('../dal/measurementDal');

// Get all measurements for a user
const getMeasurements = async (userId) => {
  return await measurementDal.getMeasurements(userId);
};

// Add new measurement
const addMeasurement = async (measurementData) => {
  console.log('Service: Calling DAL with data:', measurementData);
  const result = await measurementDal.addMeasurement(measurementData);
  console.log('Service: DAL returned:', result);
  return result;
};

// Get user's measurement goals
const getGoals = async (userId) => {
  return await measurementDal.getGoals(userId);
};

// Update user's measurement goals
const updateGoals = async (userId, goals) => {
  return await measurementDal.updateGoals(userId, goals);
};

module.exports = {
  getMeasurements,
  addMeasurement,
  getGoals,
  updateGoals
}; 