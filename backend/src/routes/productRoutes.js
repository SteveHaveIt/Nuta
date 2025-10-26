const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:slug', productController.getProductBySlug);

// Admin routes
router.post('/', authenticateToken, isAdmin, productController.createProduct);
router.put('/:id', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/:id', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;
