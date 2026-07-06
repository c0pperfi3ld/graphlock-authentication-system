/**
 * Admin-only middleware: checks that the authenticated user has the 'admin' role.
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authorized' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin access required' });
  }

  next();
};
