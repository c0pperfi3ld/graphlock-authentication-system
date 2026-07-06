import User from '../models/User.js';
import LoginAttempt from '../models/LoginAttempt.js';

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('username email role createdAt failedAttempts isLocked imageId')
      .sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
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
