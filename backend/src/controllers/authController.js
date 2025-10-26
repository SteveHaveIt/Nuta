const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nuta-secret-key-2025';

// Register user
exports.register = async (req, res) => {
  const { email, password, firstName, lastName, phone } = req.body;

  try {
    // Check if user exists
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      db.run(
        'INSERT INTO users (email, password, firstName, lastName, phone) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, phone],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });

          res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
              id: this.lastID,
              email,
              firstName,
              lastName
            }
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = (req, res) => {
  const userId = req.userId; // Set by auth middleware

  db.get('SELECT id, email, firstName, lastName, phone, role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  });
};
