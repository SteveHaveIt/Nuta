const db = require('./database');

function initializeMarketingTables() {
  // Spin Wheel Configuration
  db.run(`
    CREATE TABLE IF NOT EXISTS spin_wheel_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      active BOOLEAN DEFAULT 1,
      prizes TEXT NOT NULL,
      spinLimit INTEGER DEFAULT 1,
      spinPeriod TEXT DEFAULT 'day',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Spin Wheel Attempts
  db.run(`
    CREATE TABLE IF NOT EXISTS spin_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      email TEXT,
      phone TEXT,
      prize TEXT,
      prizeCode TEXT,
      expiryDate DATETIME,
      used BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Marketing Campaigns (Pop-ups, Banners)
  db.run(`
    CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT,
      message TEXT,
      imageUrl TEXT,
      ctaText TEXT,
      ctaLink TEXT,
      triggerType TEXT,
      triggerDelay INTEGER,
      active BOOLEAN DEFAULT 1,
      startDate DATETIME,
      endDate DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Campaign Interactions
  db.run(`
    CREATE TABLE IF NOT EXISTS campaign_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaignId INTEGER,
      userId INTEGER,
      action TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaignId) REFERENCES marketing_campaigns(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Flash Sales
  db.run(`
    CREATE TABLE IF NOT EXISTS flash_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      discountType TEXT,
      discountValue REAL,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      active BOOLEAN DEFAULT 1,
      productIds TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Affiliate Program
  db.run(`
    CREATE TABLE IF NOT EXISTS affiliates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      referralCode TEXT UNIQUE NOT NULL,
      commissionRate REAL DEFAULT 10,
      totalEarnings REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Affiliate Referrals
  db.run(`
    CREATE TABLE IF NOT EXISTS affiliate_referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      affiliateId INTEGER,
      orderId INTEGER,
      referredUserId INTEGER,
      commission REAL,
      status TEXT DEFAULT 'pending',
      paidAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (affiliateId) REFERENCES affiliates(id),
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (referredUserId) REFERENCES users(id)
    )
  `);

  // Giveaways
  db.run(`
    CREATE TABLE IF NOT EXISTS giveaways (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      prizeDescription TEXT,
      entryMethod TEXT,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      drawDate DATETIME,
      winnerId INTEGER,
      active BOOLEAN DEFAULT 1,
      notificationSent BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (winnerId) REFERENCES users(id)
    )
  `);

  // Giveaway Entries
  db.run(`
    CREATE TABLE IF NOT EXISTS giveaway_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      giveawayId INTEGER,
      userId INTEGER,
      email TEXT,
      phone TEXT,
      entryType TEXT,
      verified BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (giveawayId) REFERENCES giveaways(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Social Media Contests
  db.run(`
    CREATE TABLE IF NOT EXISTS social_contests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      prize REAL,
      requirements TEXT,
      startDate DATETIME NOT NULL,
      endDate DATETIME NOT NULL,
      winnerId INTEGER,
      active BOOLEAN DEFAULT 1,
      paymentStatus TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (winnerId) REFERENCES users(id)
    )
  `);

  // Social Contest Submissions
  db.run(`
    CREATE TABLE IF NOT EXISTS contest_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contestId INTEGER,
      userId INTEGER,
      name TEXT,
      email TEXT,
      phone TEXT,
      tiktokLink TEXT,
      facebookLink TEXT,
      twitterLink TEXT,
      verified BOOLEAN DEFAULT 0,
      verificationNotes TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contestId) REFERENCES social_contests(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Discount Codes
  db.run(`
    CREATE TABLE IF NOT EXISTS discount_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      minPurchase REAL DEFAULT 0,
      maxUses INTEGER,
      usedCount INTEGER DEFAULT 0,
      expiryDate DATETIME,
      active BOOLEAN DEFAULT 1,
      source TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Discount Code Usage
  db.run(`
    CREATE TABLE IF NOT EXISTS discount_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codeId INTEGER,
      userId INTEGER,
      orderId INTEGER,
      discountAmount REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (codeId) REFERENCES discount_codes(id),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (orderId) REFERENCES orders(id)
    )
  `);

  // Email/WhatsApp Subscribers
  db.run(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      phone TEXT,
      source TEXT,
      subscribed BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Notification Queue
  db.run(`
    CREATE TABLE IF NOT EXISTS notification_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      sentAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Marketing tables initialized');

  // Seed sample marketing data
  setTimeout(() => {
    const { seedMarketingData } = require('./seedMarketingData');
    seedMarketingData();
  }, 1000);

  // Insert default spin wheel configuration
  setTimeout(() => {
    db.get('SELECT COUNT(*) as count FROM spin_wheel_config', [], (err, row) => {
      if (!err && row && row.count === 0) {
        const defaultPrizes = JSON.stringify([
          { label: '10% OFF', value: 10, type: 'percentage', probability: 30 },
          { label: '15% OFF', value: 15, type: 'percentage', probability: 20 },
          { label: '20% OFF', value: 20, type: 'percentage', probability: 15 },
          { label: 'Free Delivery', value: 0, type: 'free_delivery', probability: 25 },
          { label: 'Try Again', value: 0, type: 'none', probability: 10 }
        ]);

        db.run(
          'INSERT INTO spin_wheel_config (name, prizes, spinLimit, spinPeriod) VALUES (?, ?, ?, ?)',
          ['Default Spin Wheel', defaultPrizes, 1, 'day'],
          (err) => {
            if (!err) console.log('Default spin wheel configuration created');
          }
        );
      }
    });
  }, 500);
}

// Initialize marketing tables
initializeMarketingTables();

module.exports = { initializeMarketingTables };
