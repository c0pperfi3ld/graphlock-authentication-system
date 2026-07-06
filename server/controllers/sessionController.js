import Session from '../models/Session.js';
import crypto from 'crypto';

// GET /api/sessions
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id, isActive: true })
      .sort({ lastAccessedAt: -1 });

    // Mark which session is the current one
    const token = req.headers.authorization?.split(' ')[1];
    const currentTokenHash = token
      ? crypto.createHash('sha256').update(token).digest('hex')
      : null;

    const sessionsData = sessions.map((s) => ({
      id: s._id,
      browser: s.browser,
      os: s.os,
      ip: s.ip,
      createdAt: s.createdAt,
      lastAccessedAt: s.lastAccessedAt,
      isCurrent: s.tokenHash === currentTokenHash,
    }));

    res.json({ sessions: sessionsData });
  } catch (err) {
    console.error('Get sessions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/sessions/:id
export const revokeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    if (session.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    session.isActive = false;
    await session.save();

    res.json({ success: true, message: 'Session revoked' });
  } catch (err) {
    console.error('Revoke session error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/sessions/revoke-all
export const revokeAllSessions = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const currentTokenHash = token
      ? crypto.createHash('sha256').update(token).digest('hex')
      : null;

    const result = await Session.updateMany(
      {
        userId: req.user._id,
        isActive: true,
        tokenHash: { $ne: currentTokenHash },
      },
      { isActive: false }
    );

    res.json({
      success: true,
      revokedCount: result.modifiedCount,
      message: `${result.modifiedCount} session(s) revoked`,
    });
  } catch (err) {
    console.error('Revoke all sessions error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
