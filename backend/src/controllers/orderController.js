const db = require('../config/database');

// Create order
exports.createOrder = (req, res) => {
  const { userId, items, shippingAddress, paymentMethod, subtotal, shipping, tax, total } = req.body;

  const orderNumber = 'ORD-' + Date.now();

  db.run(
    `INSERT INTO orders (userId, orderNumber, subtotal, shipping, tax, total, shippingAddress, paymentMethod)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [userId, orderNumber, subtotal, shipping, tax, total, JSON.stringify(shippingAddress), paymentMethod],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const orderId = this.lastID;

      // Insert order items
      const stmt = db.prepare('INSERT INTO order_items (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)');
      
      items.forEach(item => {
        stmt.run([orderId, item.productId, item.quantity, item.price]);
      });

      stmt.finalize();

      res.status(201).json({
        message: 'Order created successfully',
        orderId,
        orderNumber
      });
    }
  );
};

// Get all orders (admin)
exports.getAllOrders = (req, res) => {
  db.all(
    `SELECT o.*, u.email, u.firstName, u.lastName
     FROM orders o
     LEFT JOIN users u ON o.userId = u.id
     ORDER BY o.createdAt DESC`,
    [],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ orders });
    }
  );
};

// Get user orders
exports.getUserOrders = (req, res) => {
  const { userId } = req.params;

  db.all(
    'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
    [userId],
    (err, orders) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ orders });
    }
  );
};

// Get order by ID
exports.getOrderById = (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM orders WHERE id = ?', [id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    db.all(
      `SELECT oi.*, p.name, p.image
       FROM order_items oi
       JOIN products p ON oi.productId = p.id
       WHERE oi.orderId = ?`,
      [id],
      (err, items) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ order: { ...order, items } });
      }
    );
  });
};

// Update order status (admin)
exports.updateOrderStatus = (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  db.run(
    'UPDATE orders SET status = ?, paymentStatus = ? WHERE id = ?',
    [status, paymentStatus, id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order updated successfully' });
    }
  );
};
