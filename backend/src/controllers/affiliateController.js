const db = require('../config/database');

// Register as affiliate
exports.registerAffiliate = (req, res) => {
  const { userId, name, email, phone } = req.body;

  // Generate unique referral code
  const referralCode = 'NUTA-' + Math.random().toString(36).substr(2, 8).toUpperCase();

  db.run(
    'INSERT INTO affiliates (userId, name, email, phone, referralCode) VALUES (?, ?, ?, ?, ?)',
    [userId || null, name, email, phone, referralCode],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email already registered as affiliate' });
        }
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        success: true,
        message: 'Successfully registered as affiliate!',
        affiliateId: this.lastID,
        referralCode
      });
    }
  );
};

// Get affiliate by referral code
exports.getAffiliateByCode = (req, res) => {
  const { code } = req.params;

  db.get(
    'SELECT id, name, referralCode, commissionRate FROM affiliates WHERE referralCode = ? AND status = \'active\'',
    [code],
    (err, affiliate) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!affiliate) {
        return res.status(404).json({ error: 'Invalid referral code' });
      }
      res.json({ affiliate });
    }
  );
};

// Get affiliate dashboard data
exports.getAffiliateDashboard = (req, res) => {
  const { affiliateId } = req.params;

  db.get(
    'SELECT * FROM affiliates WHERE id = ?',
    [affiliateId],
    (err, affiliate) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!affiliate) {
        return res.status(404).json({ error: 'Affiliate not found' });
      }

      // Get referral statistics
      db.all(
        `SELECT 
          COUNT(*) as totalReferrals,
          SUM(CASE WHEN status = 'paid' THEN commission ELSE 0 END) as paidEarnings,
          SUM(CASE WHEN status = 'pending' THEN commission ELSE 0 END) as pendingEarnings
         FROM affiliate_referrals
         WHERE affiliateId = ?`,
        [affiliateId],
        (err, stats) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Get recent referrals
          db.all(
            `SELECT ar.*, o.orderNumber, o.total, o.createdAt as orderDate
             FROM affiliate_referrals ar
             JOIN orders o ON ar.orderId = o.id
             WHERE ar.affiliateId = ?
             ORDER BY ar.createdAt DESC
             LIMIT 20`,
            [affiliateId],
            (err, referrals) => {
              if (err) {
                return res.status(500).json({ error: err.message });
              }

              res.json({
                affiliate,
                stats: stats[0] || { totalReferrals: 0, paidEarnings: 0, pendingEarnings: 0 },
                recentReferrals: referrals
              });
            }
          );
        }
      );
    }
  );
};

// Track affiliate referral
exports.trackReferral = (req, res) => {
  const { referralCode, orderId, orderTotal } = req.body;

  db.get(
    'SELECT id, commissionRate FROM affiliates WHERE referralCode = ? AND status = \'active\'',
    [referralCode],
    (err, affiliate) => {
      if (err || !affiliate) {
        return res.status(404).json({ error: 'Invalid referral code' });
      }

      const commission = (orderTotal * affiliate.commissionRate) / 100;

      db.get('SELECT userId FROM orders WHERE id = ?', [orderId], (err, order) => {
        if (err || !order) {
          return res.status(404).json({ error: 'Order not found' });
        }

        db.run(
          'INSERT INTO affiliate_referrals (affiliateId, orderId, referredUserId, commission) VALUES (?, ?, ?, ?)',
          [affiliate.id, orderId, order.userId, commission],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            // Update affiliate total earnings
            db.run(
              'UPDATE affiliates SET totalEarnings = totalEarnings + ? WHERE id = ?',
              [commission, affiliate.id]
            );

            res.json({ success: true, commission });
          }
        );
      });
    }
  );
};

// Get all affiliates (admin)
exports.getAllAffiliates = (req, res) => {
  db.all(
    `SELECT a.*, 
      COUNT(ar.id) as totalReferrals,
      SUM(CASE WHEN ar.status = 'pending' THEN ar.commission ELSE 0 END) as pendingCommission
     FROM affiliates a
     LEFT JOIN affiliate_referrals ar ON a.id = ar.affiliateId
     GROUP BY a.id
     ORDER BY a.createdAt DESC`,
    [],
    (err, affiliates) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ affiliates });
    }
  );
};

// Update affiliate status (admin)
exports.updateAffiliateStatus = (req, res) => {
  const { affiliateId } = req.params;
  const { status } = req.body;

  db.run(
    'UPDATE affiliates SET status = ? WHERE id = ?',
    [status, affiliateId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
};

// Mark commission as paid (admin)
exports.markCommissionPaid = (req, res) => {
  const { referralId } = req.params;

  db.run(
    'UPDATE affiliate_referrals SET status = \'paid\', paidAt = datetime(\'now\') WHERE id = ?',
    [referralId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
};
