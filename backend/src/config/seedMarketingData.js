const db = require('./database');

function seedMarketingData() {
  console.log('Seeding marketing data...');

  // Insert sample giveaway
  db.run(`
    INSERT INTO giveaways (name, description, prizeDescription, entryMethod, startDate, endDate, drawDate, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'Monthly Nuta Hamper Giveaway',
    'Win a premium Nuta product hamper worth $100! Enter now for your chance to win.',
    'Premium Nuta Product Hamper (worth $100)',
    'Purchase any product or sign up on our website',
    new Date().toISOString(),
    new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
    new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    1
  ], (err) => {
    if (err) console.error('Error inserting giveaway:', err);
    else console.log('✓ Sample giveaway created');
  });

  // Insert sample social media contest
  const contestRequirements = JSON.stringify([
    'Post a photo or video featuring Nuta products on TikTok, Facebook, or X (Twitter)',
    'Tag @SteveHaveIt and use hashtag #NutaLove',
    'Follow @SteveHaveIt on all platforms',
    'Submit your post links through our website'
  ]);

  db.run(`
    INSERT INTO social_contests (name, description, prize, requirements, startDate, endDate, active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [
    'Win 10,000 KES Cash Prize!',
    'Share your love for Nuta products on social media and win 10,000 KES cash!',
    10000,
    contestRequirements,
    new Date().toISOString(),
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    1
  ], (err) => {
    if (err) console.error('Error inserting contest:', err);
    else console.log('✓ Sample social contest created');
  });

  // Insert sample flash sale (Friday Flash Sale)
  const nextFriday = new Date();
  nextFriday.setDate(nextFriday.getDate() + ((5 - nextFriday.getDay() + 7) % 7 || 7));
  nextFriday.setHours(0, 0, 0, 0);
  
  const fridayEnd = new Date(nextFriday);
  fridayEnd.setHours(23, 59, 59, 999);

  db.run(`
    INSERT INTO flash_sales (name, description, discountType, discountValue, startDate, endDate, active, productIds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'Friday Flash Sale - 25% OFF!',
    'Get 25% off on all Nuta products this Friday only!',
    'percentage',
    25,
    nextFriday.toISOString(),
    fridayEnd.toISOString(),
    1,
    JSON.stringify([1, 2, 3, 4, 5, 6]) // All products
  ], (err) => {
    if (err) console.error('Error inserting flash sale:', err);
    else console.log('✓ Sample flash sale created');
  });

  // Insert sample marketing campaign (popup)
  db.run(`
    INSERT INTO marketing_campaigns (name, type, title, message, ctaText, ctaLink, triggerType, triggerDelay, active, startDate, endDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'New Product Launch',
    'popup',
    'New Flavor Alert! 🎉',
    'Try our new Chocolate Peanut Butter - now available! Limited time offer: 15% off on your first order.',
    'Shop Now',
    '/products',
    'timed',
    15000, // Show after 15 seconds
    1,
    new Date().toISOString(),
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  ], (err) => {
    if (err) console.error('Error inserting campaign:', err);
    else console.log('✓ Sample marketing campaign created');
  });

  // Insert sample discount codes
  const discountCodes = [
    { code: 'WELCOME10', type: 'percentage', value: 10, description: 'Welcome discount' },
    { code: 'FRIDAY25', type: 'percentage', value: 25, description: 'Friday flash sale' },
    { code: 'FREESHIP', type: 'free_delivery', value: 0, description: 'Free delivery' }
  ];

  discountCodes.forEach(discount => {
    db.run(`
      INSERT INTO discount_codes (code, type, value, minPurchase, maxUses, expiryDate, active, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      discount.code,
      discount.type,
      discount.value,
      0,
      100,
      new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
      1,
      'admin'
    ], (err) => {
      if (err && !err.message.includes('UNIQUE')) {
        console.error(`Error inserting discount code ${discount.code}:`, err);
      } else if (!err) {
        console.log(`✓ Discount code ${discount.code} created`);
      }
    });
  });

  console.log('Marketing data seeding completed!');
}

module.exports = { seedMarketingData };
