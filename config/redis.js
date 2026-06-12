/**
 * Redis configuration for checkout-service.
 * BUG: maxmemory-policy not set to 'allkeys-lru' - defaults to 'noeviction'
 * BUG: No maxmemory limit configured
 */
module.exports = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  // BUG: No maxmemory limit - Redis will consume all available memory
  options: {
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
    // Missing: enableOfflineQueue: false (causes memory buildup during disconnects)
    enableOfflineQueue: true,
  },
};
