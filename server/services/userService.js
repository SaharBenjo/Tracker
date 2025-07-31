const userDal = require('../dal/userDal');
const jwt = require('jsonwebtoken');

class UserService {
  // Register new user
  async registerUser(userData) {
    try {
      // Validate user data
      this.validateUserData(userData);

      // Check if email already exists
      const emailExists = await userDal.emailExists(userData.email);
      if (emailExists) {
        throw new Error('כתובת האימייל כבר קיימת במערכת');
      }



      // Create user
      const user = await userDal.createUser(userData);
      
      // Generate JWT token
      const token = this.generateToken(user._id);
      
      return {
        user,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async loginUser(email, password) {
    try {
      // Find user by email
      const user = await userDal.getUserByEmail(email);
      if (!user) {
        throw new Error('כתובת אימייל או סיסמה שגויים');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('החשבון לא פעיל');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('כתובת אימייל או סיסמה שגויים');
      }

      // Update last login
      await userDal.updateLastLogin(user._id);

      // Generate JWT token
      const token = this.generateToken(user._id);

      return {
        user,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      return await userDal.getUserById(userId);
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updateData) {
    try {
      // Check if email is being updated and if it already exists
      if (updateData.email) {
        const existingUser = await userDal.getUserByEmail(updateData.email);
        if (existingUser && existingUser._id.toString() !== userId) {
          throw new Error('כתובת האימייל כבר קיימת במערכת');
        }
      }

      // Validate workout settings if provided
      if (updateData.workoutSettings) {
        this.validateWorkoutSettings(updateData.workoutSettings);
      }

      // Remove password from update data (password changes are handled separately)
      const { currentPassword, newPassword, confirmPassword, ...safeUpdateData } = updateData;
      
      return await userDal.updateUser(userId, safeUpdateData);
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user with password
      const user = await userDal.getUserById(userId);
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('הסיסמה הנוכחית שגויה');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return { message: 'הסיסמה שונתה בהצלחה' };
    } catch (error) {
      throw error;
    }
  }

  // Generate JWT token
  generateToken(userId) {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('Token לא תקין');
    }
  }

  // Validate user data
  validateUserData(userData) {
    const { email, password, firstName, lastName } = userData;

    if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
      throw new Error('כתובת אימייל לא תקינה');
    }

    if (!password || password.length < 6) {
      throw new Error('הסיסמה חייבת להיות לפחות 6 תווים');
    }

    if (!firstName || firstName.trim().length === 0) {
      throw new Error('שם פרטי הוא שדה חובה');
    }

    if (!lastName || lastName.trim().length === 0) {
      throw new Error('שם משפחה הוא שדה חובה');
    }
  }

  // Validate workout settings
  validateWorkoutSettings(workoutSettings) {
    const validWorkoutTypes = ['home', 'gym', 'other'];
    const validWorkoutPlans = ['abc', 'ab', 'fullbody'];
    const validMuscles = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs'];

    if (!workoutSettings.workoutType || !validWorkoutTypes.includes(workoutSettings.workoutType)) {
      throw new Error('סוג אימון לא תקין');
    }

    if (!workoutSettings.workoutPlan || !validWorkoutPlans.includes(workoutSettings.workoutPlan)) {
      throw new Error('תוכנית אימון לא תקינה');
    }

    if (workoutSettings.muscleGroups) {
      for (const [workout, muscles] of Object.entries(workoutSettings.muscleGroups)) {
        if (!Array.isArray(muscles)) {
          throw new Error('קבוצות שרירים חייבות להיות מערך');
        }
        
        for (const muscle of muscles) {
          if (!validMuscles.includes(muscle)) {
            throw new Error(`שריר לא תקין: ${muscle}`);
          }
        }
      }
    }
  }

  // Get user exercises
  async getUserExercises(userId) {
    try {
      const user = await userDal.getUserById(userId);
      return user.exercises || {};
    } catch (error) {
      throw error;
    }
  }

  // Update user exercises
  async updateUserExercises(userId, exercises) {
    try {
      // Validate exercises data
      if (typeof exercises !== 'object' || exercises === null) {
        throw new Error('נתוני התרגילים חייבים להיות אובייקט');
      }

      // Validate that all values are arrays of strings
      for (const [muscle, exerciseList] of Object.entries(exercises)) {
        if (!Array.isArray(exerciseList)) {
          throw new Error(`התרגילים עבור ${muscle} חייבים להיות מערך`);
        }
        
        for (const exercise of exerciseList) {
          if (typeof exercise !== 'string' || exercise.trim().length === 0) {
            throw new Error('כל תרגיל חייב להיות מחרוזת לא ריקה');
          }
        }
      }

      return await userDal.updateUserExercises(userId, exercises);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService(); 