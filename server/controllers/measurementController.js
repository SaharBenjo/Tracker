const measurementService = require('../services/measurementService');

// Get all measurements for the authenticated user
const getMeasurements = async (req, res) => {
  try {
    const measurements = await measurementService.getMeasurements(req.user.userId);
    res.json({
      success: true,
      data: measurements
    });
  } catch (error) {
    console.error('Error getting measurements:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת ההיקפים'
    });
  }
};

// Add new measurement
const addMeasurement = async (req, res) => {
  try {
    console.log('Controller: Received request body:', req.body);
    console.log('Controller: User ID:', req.user.userId);
    
    const { type, value, date } = req.body;
    
    if (!type || !value || !date) {
      console.log('Controller: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'כל השדות נדרשים'
      });
    }

    const measurementData = {
      userId: req.user.userId,
      type,
      value: parseFloat(value),
      date: new Date(date)
    };
    
    console.log('Controller: Calling service with data:', measurementData);
    const measurement = await measurementService.addMeasurement(measurementData);
    console.log('Controller: Service returned:', measurement);

    res.status(201).json({
      success: true,
      data: measurement
    });
  } catch (error) {
    console.error('Error adding measurement:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בהוספת מדידה'
    });
  }
};

// Get user's measurement goals
const getGoals = async (req, res) => {
  try {
    const goals = await measurementService.getGoals(req.user.userId);
    res.json({
      success: true,
      data: goals
    });
  } catch (error) {
    console.error('Error getting goals:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בטעינת המטרות'
    });
  }
};

// Update user's measurement goals
const updateGoals = async (req, res) => {
  try {
    const goals = req.body;
    
    if (!goals || Object.keys(goals).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'נדרשים נתוני מטרות'
      });
    }

    const updatedGoals = await measurementService.updateGoals(req.user.userId, goals);
    
    res.json({
      success: true,
      data: updatedGoals
    });
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({
      success: false,
      message: 'שגיאה בעדכון המטרות'
    });
  }
};

module.exports = {
  getMeasurements,
  addMeasurement,
  getGoals,
  updateGoals
}; 