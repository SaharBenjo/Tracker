const userService = require('../services/userService');

class UserController {
  // Register new user
  async register(req, res) {
    try {
      const userData = req.body;
      const result = await userService.registerUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'המשתמש נרשם בהצלחה',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'כתובת אימייל וסיסמה נדרשים'
        });
      }

      const result = await userService.loginUser(email, password);
      
      res.json({
        success: true,
        message: 'התחברת בהצלחה',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await userService.getUserProfile(userId);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const updateData = req.body;
      
      // If password change is included, handle it separately
      if (updateData.currentPassword && updateData.newPassword) {
        await userService.changePassword(userId, updateData.currentPassword, updateData.newPassword);
      }
      
      const user = await userService.updateUserProfile(userId, updateData);
      
      res.json({
        success: true,
        message: 'הפרופיל עודכן בהצלחה',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'סיסמה נוכחית וסיסמה חדשה נדרשות'
        });
      }

      const result = await userService.changePassword(userId, currentPassword, newPassword);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Verify token
  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Token לא נמצא'
        });
      }

      const decoded = userService.verifyToken(token);
      
      res.json({
        success: true,
        message: 'Token תקין',
        data: { userId: decoded.userId }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get user exercises
  async getExercises(req, res) {
    try {
      const userId = req.user.userId;
      const exercises = await userService.getUserExercises(userId);
      
      res.json({
        success: true,
        data: exercises
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update user exercises
  async updateExercises(req, res) {
    try {
      const userId = req.user.userId;
      const { exercises } = req.body;
      
      if (!exercises) {
        return res.status(400).json({
          success: false,
          message: 'נתוני התרגילים נדרשים'
        });
      }

      const updatedExercises = await userService.updateUserExercises(userId, exercises);
      
      res.json({
        success: true,
        message: 'התרגילים עודכנו בהצלחה',
        data: updatedExercises
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController(); 