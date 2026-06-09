module.exports = {
  port: process.env.PORT || 3002,
  paymentServiceUrl: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003',
  inventoryServiceUrl: process.env.INVENTORY_SERVICE_URL || 'http://localhost:3004',
};
