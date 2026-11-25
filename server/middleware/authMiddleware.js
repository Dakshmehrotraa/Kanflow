import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * `protect` — gate for every private route.
 * Verifies the stateless Bearer JWT and attaches the live user to req.user.
 */
export const protect = async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized — user no longer exists' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized — token invalid or expired' });
  }
};

/**
 * `requireRole` — global account-role guard (e.g. admin-only routes).
 * Usage: router.delete('/x', protect, requireRole('admin'), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden — insufficient account role' });
  }
  next();
};
