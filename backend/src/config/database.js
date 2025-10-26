const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/nuta.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      phone TEXT,
      role TEXT DEFAULT 'customer',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
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
    )
  `);

  // Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
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
    )
  `);

  // Order items table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId INTEGER,
      productId INTEGER,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    )
  `);

  // Blog posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS blog_posts (
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
    )
  `);

  // Insert sample products after a delay to ensure tables are created
  setTimeout(() => {
    db.get('SELECT COUNT(*) as count FROM products', [], (err, row) => {
      if (err) {
        console.error('Error checking products:', err);
        return;
      }
      if (row && row.count === 0) {
      const products = [
        {
          slug: 'creamy-peanut-butter',
          name: 'Creamy Peanut Butter',
          description: 'Our signature creamy peanut butter is made from 100% premium roasted peanuts. Smooth, rich, and packed with natural protein and healthy fats.',
          price: 12.99,
          category: 'butter',
          image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop',
          stock: 45,
          rating: 4.8,
          reviews: 124,
          featured: 1
        },
        {
          slug: 'crunchy-peanut-butter',
          name: 'Crunchy Peanut Butter',
          description: 'Love a bit of texture? Our crunchy peanut butter combines smooth peanut butter with crunchy peanut pieces for the perfect bite.',
          price: 13.99,
          category: 'butter',
          image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=600&h=600&fit=crop',
          stock: 38,
          rating: 4.9,
          reviews: 98,
          featured: 1
        },
        {
          slug: 'roasted-peanuts',
          name: 'Premium Roasted Peanuts',
          description: 'Perfectly roasted peanuts with just the right amount of crunch. A healthy snack packed with protein and nutrients.',
          price: 8.99,
          category: 'nuts',
          image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600&h=600&fit=crop',
          stock: 67,
          rating: 4.7,
          reviews: 156,
          featured: 1
        },
        {
          slug: 'honey-peanut-butter',
          name: 'Honey Peanut Butter',
          description: 'Our creamy peanut butter sweetened naturally with pure honey. A delicious combination that kids and adults love.',
          price: 14.99,
          category: 'butter',
          image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&h=600&fit=crop',
          stock: 32,
          rating: 4.9,
          reviews: 87,
          featured: 1
        },
        {
          slug: 'salted-roasted-peanuts',
          name: 'Salted Roasted Peanuts',
          description: 'Classic roasted peanuts with a touch of sea salt. The perfect savory snack for any occasion.',
          price: 9.99,
          category: 'nuts',
          image: 'https://images.unsplash.com/photo-1608797178974-15b35a64ede9?w=600&h=600&fit=crop',
          stock: 54,
          rating: 4.6,
          reviews: 203,
          featured: 0
        },
        {
          slug: 'chocolate-peanut-butter',
          name: 'Chocolate Peanut Butter',
          description: 'Indulge in the perfect blend of premium peanut butter and rich chocolate. A treat that satisfies your sweet tooth.',
          price: 15.99,
          category: 'butter',
          image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=600&h=600&fit=crop',
          stock: 28,
          rating: 4.8,
          reviews: 145,
          featured: 0
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO products (slug, name, description, price, category, image, stock, rating, reviews, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      products.forEach(product => {
        stmt.run([
          product.slug,
          product.name,
          product.description,
          product.price,
          product.category,
          product.image,
          product.stock,
          product.rating,
          product.reviews,
          product.featured
        ]);
      });

      stmt.finalize();
      console.log('Sample products inserted');
      }
    });
  }, 500);
}

module.exports = db;
