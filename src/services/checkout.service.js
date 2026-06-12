const { cacheService } = require('./cache.service');
const { logger } = require('../utils/logger');

/**
 * Checkout service - caches intermediate state without TTL.
 * Each checkout creates multiple cache entries that never expire.
 */
class CheckoutService {
  async processCheckout(userId, items) {
    // Cache cart state (no TTL - memory leak)
    await cacheService.cacheCart(userId, { items, timestamp: Date.now() });

    // Cache each item reservation separately (compounds the leak)
    for (const item of items) {
      await cacheService.cacheSession(
        `reservation:${userId}:${item.sku}`,
        { quantity: item.quantity, reservedAt: Date.now() }
      );
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    // Store order reference in cache (never cleaned up)
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await cacheService.cacheSession(`order:${orderId}`, {
      userId,
      items,
      total,
      createdAt: Date.now(),
    });

    logger.info(`Checkout processed for user ${userId}, order ${orderId}`);
    return { orderId, total, status: 'confirmed' };
  }

  /**
   * BUG: Only invalidates cart key, not reservation/order keys
   */
  async cancelCheckout(userId) {
    await cacheService.invalidateCart(userId);
    // Missing: cleanup reservation:${userId}:* keys
    // Missing: cleanup order:* keys
    logger.warn(`Cancel checkout for ${userId} - partial cleanup only`);
  }
}

module.exports = { checkoutService: new CheckoutService() };
