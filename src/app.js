const express = require('express');
const checkoutRoutes = require('./routes/checkout');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/checkout', checkoutRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'checkout-service', uptime: process.uptime() });
});

app.listen(PORT, () => {
  logger.info(`checkout-service running on port ${PORT}`);
});

module.exports = app;
