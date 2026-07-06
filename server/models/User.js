import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'Username is required'],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    textPasswordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    imageId: {
      type: String,
      required: [true, 'Image selection is required'],
    },
    clickPoints: [
      {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    ],
    numClickPoints: {
      type: Number,
      default: 5,
    },
    toleranceRadius: {
      type: Number,
      default: 18,
    },
    precisionHistory: {
      type: [Number],
      default: [],
    },
    decoyClickPoints: [
      {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
      },
    ],
    hasDecoy: {
      type: Boolean,
      default: false,
    },
    passwordCreatedAt: {
      type: Date,
      default: Date.now,
    },
    passwordExpiryDays: {
      type: Number,
      default: 90,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    lockedUntil: {
      type: Date,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Pre-save hook: hash textPasswordHash if modified and not already hashed
userSchema.pre('save', async function (next) {
  if (this.isModified('textPasswordHash') && !this.textPasswordHash.startsWith('$2')) {
    this.textPasswordHash = await bcrypt.hash(this.textPasswordHash, 10);
  }
  next();
});

// Compare text password
userSchema.methods.compareTextPassword = async function (password) {
  return bcrypt.compare(password, this.textPasswordHash);
};

// Check if graphical password has expired
userSchema.methods.isPasswordExpired = function () {
  const expiryDate = new Date(this.passwordCreatedAt);
  expiryDate.setDate(expiryDate.getDate() + this.passwordExpiryDays);
  return new Date() > expiryDate;
};

// Update adaptive tolerance based on precision score
userSchema.methods.updateAdaptiveTolerance = function (precisionScore) {
  this.precisionHistory.push(precisionScore);

  // Keep only the last 10 entries
  if (this.precisionHistory.length > 10) {
    this.precisionHistory = this.precisionHistory.slice(-10);
  }

  // Recalculate tolerance as average precision * 1.5, clamped between 10 and 30
  const avg =
    this.precisionHistory.reduce((sum, val) => sum + val, 0) /
    this.precisionHistory.length;
  let newTolerance = avg * 1.5;
  newTolerance = Math.max(10, Math.min(30, newTolerance));
  this.toleranceRadius = newTolerance;
};

const User = mongoose.model('User', userSchema);
export default User;
