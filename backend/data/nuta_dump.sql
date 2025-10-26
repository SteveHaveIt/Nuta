CREATE TABLE orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      orderNumber TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'pending',
      subtotal REAL NOT NULL,
      shipping REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      shippingAddress TEXT,
      paymentMethod TEXT,
      paymentStatus TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image TEXT,
      stock INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      reviews INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER,
      productId INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );
CREATE TABLE blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      image TEXT,
      category TEXT,
      author TEXT,
      readTime TEXT,
      published BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE campaign_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaignId INTEGER,
      userId INTEGER,
      action TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaignId) REFERENCES marketing_campaigns(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    );
CREATE TABLE flash_sales (
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
    );
CREATE TABLE affiliates (
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
    );
CREATE TABLE affiliate_referrals (
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
    );
CREATE TABLE giveaways (
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
    );
CREATE TABLE giveaway_entries (
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
    );
CREATE TABLE marketing_campaigns (
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
    );
CREATE TABLE social_contests (
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
    );
CREATE TABLE contest_submissions (
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
    );
CREATE TABLE discount_codes (
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
    );
CREATE TABLE discount_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codeId INTEGER,
      userId INTEGER,
      orderId INTEGER,
      discountAmount REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (codeId) REFERENCES discount_codes(id),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (orderId) REFERENCES orders(id)
    );
CREATE TABLE subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      phone TEXT,
      source TEXT,
      subscribed BOOLEAN DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE notification_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      sentAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE spin_wheel_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      active BOOLEAN DEFAULT 1,
      prizes TEXT NOT NULL,
      spinLimit INTEGER DEFAULT 1,
      spinPeriod TEXT DEFAULT 'day',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
CREATE TABLE spin_attempts (
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
    );