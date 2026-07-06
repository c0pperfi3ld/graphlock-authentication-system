import User from '../models/User.js';

/**
 * Check if a user account is locked due to too many failed login attempts.
 */
export const checkLockout = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return next();
    }

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      // User not found — let the controller handle the "invalid credentials" response
      return next();
    }

    if (user.isLocked && user.lockedUntil) {
      const now = new Date();

      if (user.lockedUntil > now) {
        // Account is still locked
        const minutesRemaining = Math.ceil((user.lockedUntil - now) / (1000 * 60));
        return res.status(423).json({
          error: 'Account locked due to too many failed login attempts',
          lockedUntil: user.lockedUntil,
          minutesRemaining,
        });
      }

      // Lock period has passed — unlock the account
      user.isLocked = false;
      user.failedAttempts = 0;
      user.lockedUntil = undefined;
      await user.save();
    }

    next();
  } catch (error) {
    return res.status(500).json({ error: 'Server error during lockout check' });
  }
};
