const app = require('../src/app');
const assert = require('assert');

describe('Checkout Service', () => {
  it('should return health status', () => {
    assert.ok(app);
  });
});
