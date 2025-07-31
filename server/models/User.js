const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'כתובת אימייל לא תקינה']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profilePicture: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  workoutSettings: {
    workoutType: {
      type: String,
      enum: ['home', 'gym', 'other'],
      default: 'home'
    },
    workoutPlan: {
      type: String,
      enum: ['abc', 'ab', 'fullbody'],
      default: 'abc'
    },
    muscleGroups: {
      a: [{
        type: String,
        enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs']
      }],
      b: [{
        type: String,
        enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs']
      }],
      c: [{
        type: String,
        enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs']
      }],
      fullbody: [{
        type: String,
        enum: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs']
      }]
    }
  },
  exercises: {
    type: Map,
    of: [String],
    default: {}
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Indexes for better performance
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema); 