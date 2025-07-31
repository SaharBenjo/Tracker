const User = require('../models/User');

class UserDal {
  // Create new user
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }



  // Update user
  async updateUser(id, updateData) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Get all users (for admin)
  async getAllUsers() {
    try {
      return await User.find().select('-password');
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  // Update last login
  async updateLastLogin(id) {
    try {
      return await User.findByIdAndUpdate(
        id,
        { lastLogin: new Date() },
        { new: true }
      );
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  // Check if email exists
  async emailExists(email) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      return !!user;
    } catch (error) {
      throw new Error(`Error checking email: ${error.message}`);
    }
  }

  // Update user exercises
  async updateUserExercises(id, exercises) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { exercises },
        { new: true, runValidators: true }
      );
      if (!user) {
        throw new Error('User not found');
      }
      return user.exercises;
    } catch (error) {
      throw new Error(`Error updating user exercises: ${error.message}`);
    }
  }
}

module.exports = new UserDal(); 