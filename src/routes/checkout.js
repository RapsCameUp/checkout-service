const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');

router.post('/', (req, res) => {
  const { cartId, userId, items } = req.body;
  if (!cartId || !userId) {
    return res.status(400).json({ error: 'cartId and userId required' });
  }
  const orderId = `ORD-${Date.now()}`;
  logger.info(`Checkout initiated: ${orderId} for user ${userId}`);
  res.json({ orderId, status: 'pending', cartId, userId, items: items || [] });
});

router.get('/:orderId', (req, res) => {
  logger.info(`Order lookup: ${req.params.orderId}`);
  res.json({
    orderId: req.params.orderId,
    status: 'completed',
    total: 99.99,
    items: [{ sku: 'ITEM-001', qty: 2, price: 49.99 }],
  });
});

router.post('/:orderId/cancel', (req, res) => {
  const { reason } = req.body;
  logger.info(`Order cancelled: ${req.params.orderId}`);
  res.json({ orderId: req.params.orderId, status: 'cancelled', reason });
});

module.exports = router;
