const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nuta-secret-key-2025';

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = user.userId;
    req.userEmail = user.email;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  const db = require('../config/database');
  
  db.get('SELECT role FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};
