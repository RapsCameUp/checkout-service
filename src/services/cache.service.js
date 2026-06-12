const Redis = require('ioredis');
const { logger } = require('../utils/logger');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
  maxRetriesPerRequest: 3,
});

/**
 * Cache service for checkout operations.
 * BUG: No TTL set on cache entries - keys accumulate indefinitely causing OOM.
 * BUG: No eviction policy configured - memory grows unbounded.
 */
class CacheService {
  // Store cart data without expiry (memory leak!)
  async cacheCart(userId, cartData) {
    // Missing TTL - this causes unbounded memory growth
    await redis.set(`cart:${userId}`, JSON.stringify(cartData));
    logger.info(`Cached cart for user ${userId}`);
  }

  // Store session data without expiry
  async cacheSession(sessionId, data) {
    await redis.set(`session:${sessionId}`, JSON.stringify(data));
  }

  // Invalidation that doesn't clear related keys (stale keys accumulate)
  async invalidateCart(userId) {
    await redis.del(`cart:${userId}`);
    // BUG: Doesn't clean up related keys like cart:${userId}:items, cart:${userId}:meta
    logger.info(`Invalidated cart for user ${userId} (partial cleanup only)`);
  }

  async getCart(userId) {
    const data = await redis.get(`cart:${userId}`);
    return data ? JSON.parse(data) : null;
  }

  // Connection pool not properly bounded
  async getConnectionCount() {
    const info = await redis.info('clients');
    const match = info.match(/connected_clients:(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
}

module.exports = { cacheService: new CacheService() };
