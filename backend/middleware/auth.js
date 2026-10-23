const jwt = require('jsonwebtoken');

// Verifies the "Authorization: Bearer <token>" header and attaches the
// decoded payload ({ id, userType }) to req.user. Use on any route that
// should only work for a logged-in user.
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing auth token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Restricts a route to specific userType values, e.g. requireRole('admin').
// Must be used after requireAuth.
function requireRole(...allowedTypes) {
  return (req, res, next) => {
    if (!req.user || !allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({ message: 'Not authorized for this action' });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
