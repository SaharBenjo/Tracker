const express = require('express');
const router = express.Router();
// const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Rate limiting temporarily disabled for development
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 auth requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many authentication attempts, please try again later.'
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// POST /api/users/register - Register new user
router.post('/register', userController.register);

// POST /api/users/login - Login user
router.post('/login', userController.login);

// GET /api/users/verify - Verify token
router.get('/verify', userController.verifyToken);

// GET /api/users/profile - Get user profile (requires auth)
router.get('/profile', authMiddleware, userController.getProfile);

// PUT /api/users/profile - Update user profile (requires auth)
router.put('/profile', authMiddleware, userController.updateProfile);

// POST /api/users/change-password - Change password (requires auth)
router.post('/change-password', authMiddleware, userController.changePassword);

// GET /api/users/exercises - Get user exercises (requires auth)
router.get('/exercises', authMiddleware, userController.getExercises);

// PUT /api/users/exercises - Update user exercises (requires auth)
router.put('/exercises', authMiddleware, userController.updateExercises);

module.exports = router; 