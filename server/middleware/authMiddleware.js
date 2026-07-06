import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect middleware: verifies JWT token and attaches user to request.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and exclude password hash
    const user = await User.findById(decoded.userId).select('-textPasswordHash');

    if (!user) {
      return res.status(401).json({ error: 'Not authorized, user not found' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Not authorized, token expired' });
    }
    return res.status(500).json({ error: 'Authentication error' });
  }
};
