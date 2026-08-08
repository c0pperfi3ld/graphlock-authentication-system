import User from '../models/User.js';
import LoginAttempt from '../models/LoginAttempt.js';
import Session from '../models/Session.js';
import Note from '../models/Note.js';
import Credential from '../models/Credential.js';

// GET /api/admin/users — list all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('username email role createdAt failedAttempts isLocked imageId hasDecoy')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/admin/users/:userId — delete a user and all associated data
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-deletion
    if (req.user._id.toString() === userId) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Cascade delete user data
    await User.findByIdAndDelete(userId);
    await Note.deleteMany({ userId });
    await Credential.deleteMany({ userId });
    await Session.deleteMany({ userId });
    await LoginAttempt.deleteMany({ userId });

    res.json({ success: true, message: `User "${user.username}" deleted successfully` });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/admin/users/:userId/lock — toggle account lock state
export const toggleUserLock = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isLocked = !user.isLocked;
    if (!user.isLocked) {
      user.failedAttempts = 0;
      user.lockedUntil = null;
    } else {
      user.lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hr lock
    }

    await user.save();
    res.json({ success: true, isLocked: user.isLocked, user });
  } catch (err) {
    console.error('Toggle lock error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/admin/users/:userId/role — update role (user <-> admin)
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    if (req.user._id.toString() === userId && role !== 'admin') {
      return res.status(400).json({ error: 'Cannot demote your own admin account' });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('username email role');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/users/:userId/vault — inspect a specific user's vault items
export const getUserVault = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('username email role imageId hasDecoy');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notes = await Note.find({ userId }).sort({ updatedAt: -1 });
    const credentials = await Credential.find({ userId }).sort({ updatedAt: -1 });

    res.json({
      user,
      notes,
      credentials,
    });
  } catch (err) {
    console.error('Get user vault error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/heatmap-data/:imageId
export const getHeatmapData = async (req, res) => {
  try {
    const { imageId } = req.params;
    const attempts = await LoginAttempt.find({ imageId }).select('clickPoints');

    const clickData = [];
    for (const attempt of attempts) {
      for (const point of attempt.clickPoints) {
        clickData.push({ x: point.x, y: point.y });
      }
    }

    res.json({ clickData, totalAttempts: attempts.length });
  } catch (err) {
    console.error('Get heatmap data error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLogins = await LoginAttempt.countDocuments();
    const successfulLogins = await LoginAttempt.countDocuments({ success: true });
    const successRate = totalLogins > 0 ? ((successfulLogins / totalLogins) * 100).toFixed(1) : 0;

    const recentAttempts = await LoginAttempt.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('username success imageId ip createdAt');

    res.json({
      totalUsers,
      totalLogins,
      successfulLogins,
      successRate: parseFloat(successRate),
      recentAttempts,
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
