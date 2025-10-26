const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const marketingRoutes = require('./routes/marketingRoutes');

// Initialize marketing database
require('./config/marketingDatabase');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for admin dashboard
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/marketing', marketingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nuta API is running' });
});

// Admin dashboard route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Nuta E-commerce API',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      orders: '/api/orders',
      auth: '/api/auth',
      marketing: '/api/marketing',
      admin: '/admin'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
