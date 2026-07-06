import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  username: {
    type: String,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
  },
  clickPoints: [
    {
      x: { type: Number },
      y: { type: Number },
    },
  ],
  imageId: {
    type: String,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index: auto-delete documents after 90 days
loginAttemptSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);
export default LoginAttempt;
