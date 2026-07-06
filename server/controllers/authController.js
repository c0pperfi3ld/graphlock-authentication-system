import User from '../models/User.js';
import LoginAttempt from '../models/LoginAttempt.js';
import Session from '../models/Session.js';
import { verifyClickPoints } from '../utils/toleranceCheck.js';
import { analyzeHotspots, calculatePasswordStrength } from '../utils/hotspotAnalysis.js';
import { parseUA } from '../utils/parseUserAgent.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const createSession = async (userId, token, req) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const { browser, os } = parseUA(req.headers['user-agent'] || '');
  return Session.create({
    userId,
    tokenHash,
    ip: req.ip || req.connection?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'unknown',
    browser,
    os,
  });
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, textPassword, imageId, clickPoints } = req.body;

    if (!username || !email || !textPassword || !imageId || !clickPoints) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!Array.isArray(clickPoints) || clickPoints.length < 3 || clickPoints.length > 8) {
      return res.status(400).json({ error: 'Click points must be an array of 3-8 points' });
    }
    if (textPassword.length < 6) {
      return res.status(400).json({ error: 'Text password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      const field = existingUser.username === username.toLowerCase() ? 'Username' : 'Email';
      return res.status(409).json({ error: `${field} already exists` });
    }

    const user = await User.create({
      username,
      email,
      textPasswordHash: textPassword,
      imageId,
      clickPoints,
      numClickPoints: clickPoints.length,
    });

    const token = generateToken(user._id);
    await createSession(user._id, token, req);

    // Analyze password strength
    const strength = calculatePasswordStrength(clickPoints);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        imageId: user.imageId,
      },
      passwordStrength: strength,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { username, clickPoints, imageId } = req.body;

    if (!username || !clickPoints || !imageId) {
      return res.status(400).json({ error: 'Username, click points, and image are required' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check lockout
    if (user.isLocked && user.lockedUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockedUntil - new Date()) / 60000);
      return res.status(423).json({
        error: 'Account is locked',
        lockedUntil: user.lockedUntil,
        minutesRemaining,
      });
    }
    // Auto-unlock if lockout period passed
    if (user.isLocked && user.lockedUntil <= new Date()) {
      user.isLocked = false;
      user.failedAttempts = 0;
    }

    // Tolerance on 0-100 scale: toleranceRadius is in px for ~1000px image, so divide by 10
    const tolerance = user.toleranceRadius / 10;
    const result = verifyClickPoints(clickPoints, user.clickPoints, tolerance);

    if (result.match) {
      // Successful login
      user.failedAttempts = 0;
      user.isLocked = false;
      user.updateAdaptiveTolerance(result.avgPrecision);
      await user.save();

      const token = generateToken(user._id);
      await createSession(user._id, token, req);

      await LoginAttempt.create({
        userId: user._id,
        username: user.username,
        success: true,
        clickPoints,
        imageId,
        ip: req.ip || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown',
      });

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          imageId: user.imageId,
        },
        isDecoy: false,
      });
    }

    // Check decoy password
    if (user.hasDecoy && user.decoyClickPoints.length > 0) {
      const decoyResult = verifyClickPoints(clickPoints, user.decoyClickPoints, tolerance);
      if (decoyResult.match) {
        user.failedAttempts = 0;
        user.isLocked = false;
        await user.save();

        const token = generateToken(user._id);
        await createSession(user._id, token, req);

        await LoginAttempt.create({
          userId: user._id,
          username: user.username,
          success: true,
          clickPoints,
          imageId,
          ip: req.ip || 'unknown',
          userAgent: req.headers['user-agent'] || 'unknown',
        });

        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            imageId: user.imageId,
          },
          isDecoy: true,
        });
      }
    }

    // Failed login
    user.failedAttempts += 1;
    const maxAttempts = parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5;
    const lockoutMinutes = parseInt(process.env.LOCKOUT_DURATION_MINUTES) || 15;

    if (user.failedAttempts >= maxAttempts) {
      user.isLocked = true;
      user.lockedUntil = new Date(Date.now() + lockoutMinutes * 60000);
    }
    await user.save();

    await LoginAttempt.create({
      userId: user._id,
      username: user.username,
      success: false,
      clickPoints,
      imageId,
      ip: req.ip || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    });

    const attemptsRemaining = Math.max(0, maxAttempts - user.failedAttempts);
    return res.status(401).json({
      error: 'Invalid credentials',
      attemptsRemaining,
      locked: user.isLocked,
      lockedUntil: user.lockedUntil || null,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// POST /api/auth/login-text
export const loginWithText = async (req, res) => {
  try {
    const { username, textPassword } = req.body;
    if (!username || !textPassword) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.compareTextPassword(textPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset lockout on successful text login
    user.failedAttempts = 0;
    user.isLocked = false;
    await user.save();

    const token = generateToken(user._id);
    await createSession(user._id, token, req);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        imageId: user.imageId,
      },
    });
  } catch (err) {
    console.error('Text login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        imageId: user.imageId,
        hasDecoy: user.hasDecoy,
        createdAt: user.createdAt,
      },
      passwordExpired: user.isPasswordExpired(),
      daysRemaining: (() => {
        const expiry = new Date(user.passwordCreatedAt);
        expiry.setDate(expiry.getDate() + user.passwordExpiryDays);
        return Math.max(0, Math.ceil((expiry - new Date()) / 86400000));
      })(),
    });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/auth/setup-decoy
export const setupDecoy = async (req, res) => {
  try {
    const { clickPoints } = req.body;
    if (!Array.isArray(clickPoints) || clickPoints.length < 3 || clickPoints.length > 8) {
      return res.status(400).json({ error: 'Click points must be an array of 3-8 points' });
    }

    const user = await User.findById(req.user._id);
    user.decoyClickPoints = clickPoints;
    user.hasDecoy = true;
    await user.save();

    res.json({ success: true, message: 'Decoy password set successfully' });
  } catch (err) {
    console.error('Setup decoy error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/auth/reset-graphical-password
export const resetGraphicalPassword = async (req, res) => {
  try {
    const { imageId, clickPoints } = req.body;
    if (!imageId || !Array.isArray(clickPoints) || clickPoints.length < 3) {
      return res.status(400).json({ error: 'Image and click points are required' });
    }

    const user = await User.findById(req.user._id);
    user.imageId = imageId;
    user.clickPoints = clickPoints;
    user.numClickPoints = clickPoints.length;
    user.passwordCreatedAt = new Date();
    user.toleranceRadius = parseInt(process.env.DEFAULT_TOLERANCE_RADIUS) || 18;
    user.precisionHistory = [];
    await user.save();

    res.json({ success: true, message: 'Graphical password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
