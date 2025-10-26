const db = require('../config/database');

// Get active campaigns
exports.getActiveCampaigns = (req, res) => {
  const now = new Date().toISOString();
  
  db.all(
    `SELECT * FROM marketing_campaigns 
     WHERE active = 1 
     AND (startDate IS NULL OR startDate <= ?)
     AND (endDate IS NULL OR endDate >= ?)
     ORDER BY createdAt DESC`,
    [now, now],
    (err, campaigns) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ campaigns });
    }
  );
};

// Track campaign interaction
exports.trackInteraction = (req, res) => {
  const { campaignId, userId, action } = req.body;

  db.run(
    'INSERT INTO campaign_interactions (campaignId, userId, action) VALUES (?, ?, ?)',
    [campaignId, userId || null, action],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
};

// Get active flash sales
exports.getActiveFlashSales = (req, res) => {
  const now = new Date().toISOString();
  
  db.all(
    `SELECT * FROM flash_sales 
     WHERE active = 1 
     AND startDate <= ?
     AND endDate >= ?
     ORDER BY startDate DESC`,
    [now, now],
    (err, sales) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      sales = sales.map(sale => ({
        ...sale,
        productIds: sale.productIds ? JSON.parse(sale.productIds) : []
      }));

      res.json({ flashSales: sales });
    }
  );
};

// Apply discount code
exports.applyDiscountCode = (req, res) => {
  const { code, userId, orderTotal } = req.body;

  db.get(
    `SELECT * FROM discount_codes 
     WHERE code = ? 
     AND active = 1 
     AND (expiryDate IS NULL OR expiryDate >= datetime('now'))
     AND (maxUses IS NULL OR usedCount < maxUses)`,
    [code.toUpperCase()],
    (err, discount) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!discount) {
        return res.status(404).json({ error: 'Invalid or expired discount code' });
      }

      if (orderTotal < discount.minPurchase) {
        return res.status(400).json({ 
          error: `Minimum purchase of $${discount.minPurchase} required` 
        });
      }

      let discountAmount = 0;
      if (discount.type === 'percentage') {
        discountAmount = (orderTotal * discount.value) / 100;
      } else if (discount.type === 'fixed') {
        discountAmount = discount.value;
      } else if (discount.type === 'free_delivery') {
        discountAmount = 5; // Assuming $5 delivery fee
      }

      res.json({
        valid: true,
        discount: {
          code: discount.code,
          type: discount.type,
          value: discount.value,
          discountAmount: Math.min(discountAmount, orderTotal)
        }
      });
    }
  );
};

// Record discount usage
exports.recordDiscountUsage = (req, res) => {
  const { code, userId, orderId, discountAmount } = req.body;

  db.get('SELECT id FROM discount_codes WHERE code = ?', [code], (err, discount) => {
    if (err || !discount) {
      return res.status(404).json({ error: 'Discount code not found' });
    }

    db.run(
      'INSERT INTO discount_usage (codeId, userId, orderId, discountAmount) VALUES (?, ?, ?, ?)',
      [discount.id, userId, orderId, discountAmount],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Update usage count
        db.run('UPDATE discount_codes SET usedCount = usedCount + 1 WHERE id = ?', [discount.id]);

        res.json({ success: true });
      }
    );
  });
};

// Subscribe to newsletter
exports.subscribe = (req, res) => {
  const { email, phone, source } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ error: 'Email or phone required' });
  }

  db.run(
    'INSERT OR REPLACE INTO subscribers (email, phone, source) VALUES (?, ?, ?)',
    [email, phone, source || 'website'],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Successfully subscribed!' });
    }
  );
};
