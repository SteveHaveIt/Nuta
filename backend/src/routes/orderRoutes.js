const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/', authenticateToken, orderController.createOrder);
router.get('/user/:userId', authenticateToken, orderController.getUserOrders);
router.get('/:id', authenticateToken, orderController.getOrderById);

// Admin routes
router.get('/', authenticateToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticateToken, isAdmin, orderController.updateOrderStatus);

module.exports = router;
