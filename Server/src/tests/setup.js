const { afterAll, beforeAll, jest } = require('@jest/globals');

require('dotenv').config({ path: '.env.test' });

// Set test environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.MONGODB_TEST_URI = 'mongodb://localhost:27017/visitor-management-test';

// Increase timeout for all tests
jest.setTimeout(10000);

// Suppress console logs during tests
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

// Clean up after all tests
afterAll(async () => {
  // Add any global cleanup here
}); 