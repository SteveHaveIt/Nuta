const db = require('../config/database');

// Get all products
exports.getAllProducts = (req, res) => {
  const { category, featured } = req.query;
  
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (featured === 'true') {
    query += ' AND featured = 1';
  }

  query += ' ORDER BY createdAt DESC';

  db.all(query, params, (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ products });
  });
};

// Get product by slug
exports.getProductBySlug = (req, res) => {
  const { slug } = req.params;

  db.get('SELECT * FROM products WHERE slug = ?', [slug], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  });
};

// Create product (admin only)
exports.createProduct = (req, res) => {
  const { slug, name, description, price, category, image, stock, featured } = req.body;

  db.run(
    `INSERT INTO products (slug, name, description, price, category, image, stock, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [slug, name, description, price, category, image, stock || 0, featured || 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({
        message: 'Product created successfully',
        productId: this.lastID
      });
    }
  );
};

// Update product (admin only)
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image, stock, featured } = req.body;

  db.run(
    `UPDATE products 
     SET name = ?, description = ?, price = ?, category = ?, image = ?, stock = ?, featured = ?
     WHERE id = ?`,
    [name, description, price, category, image, stock, featured, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json({ message: 'Product updated successfully' });
    }
  );
};

// Delete product (admin only)
exports.deleteProduct = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
};
