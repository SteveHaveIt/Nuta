const db = require('../config/database');

// Get active spin wheel configuration
exports.getSpinWheelConfig = (req, res) => {
  db.get('SELECT * FROM spin_wheel_config WHERE active = 1 ORDER BY id DESC LIMIT 1', [], (err, config) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!config) {
      return res.status(404).json({ error: 'No active spin wheel configuration found' });
    }
    
    config.prizes = JSON.parse(config.prizes);
    res.json({ config });
  });
};

// Check if user can spin
exports.canUserSpin = (req, res) => {
  const { email, phone } = req.query;

  if (!email && !phone) {
    return res.status(400).json({ error: 'Email or phone required' });
  }

  // Get active config
  db.get('SELECT * FROM spin_wheel_config WHERE active = 1 ORDER BY id DESC LIMIT 1', [], (err, config) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const period = config.spinPeriod === 'day' ? 'date(\'now\')' : 'datetime(\'now\', \'-7 days\')';
    
    let query = `SELECT COUNT(*) as count FROM spin_attempts WHERE createdAt >= ${period}`;
    const params = [];

    if (email) {
      query += ' AND email = ?';
      params.push(email);
    } else {
      query += ' AND phone = ?';
      params.push(phone);
    }

    db.get(query, params, (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const canSpin = row.count < config.spinLimit;
      res.json({ canSpin, attemptsLeft: Math.max(0, config.spinLimit - row.count) });
    });
  });
};

// Perform spin
exports.spin = (req, res) => {
  const { email, phone, userId } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ error: 'Email or phone required' });
  }

  // Get active config
  db.get('SELECT * FROM spin_wheel_config WHERE active = 1 ORDER BY id DESC LIMIT 1', [], (err, config) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const prizes = JSON.parse(config.prizes);
    
    // Select prize based on probability
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    let random = Math.random() * totalProbability;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      random -= prize.probability;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // Generate unique code
    const prizeCode = selectedPrize.type !== 'none' 
      ? 'SPIN-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      : null;

    // Set expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Save spin attempt
    db.run(
      `INSERT INTO spin_attempts (userId, email, phone, prize, prizeCode, expiryDate)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId || null, email, phone, JSON.stringify(selectedPrize), prizeCode, expiryDate.toISOString()],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Create discount code if applicable
        if (prizeCode && selectedPrize.type !== 'none') {
          db.run(
            `INSERT INTO discount_codes (code, type, value, expiryDate, source)
             VALUES (?, ?, ?, ?, ?)`,
            [prizeCode, selectedPrize.type, selectedPrize.value, expiryDate.toISOString(), 'spin_wheel']
          );
        }

        // Add to subscribers
        if (email) {
          db.run(
            'INSERT OR IGNORE INTO subscribers (email, source) VALUES (?, ?)',
            [email, 'spin_wheel']
          );
        }

        res.json({
          success: true,
          prize: selectedPrize,
          code: prizeCode,
          expiryDate: expiryDate.toISOString()
        });
      }
    );
  });
};

// Get user's spin history
exports.getSpinHistory = (req, res) => {
  const { email, phone } = req.query;

  let query = 'SELECT * FROM spin_attempts WHERE 1=1';
  const params = [];

  if (email) {
    query += ' AND email = ?';
    params.push(email);
  }
  if (phone) {
    query += ' AND phone = ?';
    params.push(phone);
  }

  query += ' ORDER BY createdAt DESC LIMIT 10';

  db.all(query, params, (err, attempts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    attempts = attempts.map(attempt => ({
      ...attempt,
      prize: JSON.parse(attempt.prize)
    }));

    res.json({ attempts });
  });
};
