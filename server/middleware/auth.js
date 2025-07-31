const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token לא נמצא'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = userService.verifyToken(token);
    
    // Add user info to request
    req.user = {
      userId: decoded.userId
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token לא תקין'
    });
  }
};

module.exports = authMiddleware; 