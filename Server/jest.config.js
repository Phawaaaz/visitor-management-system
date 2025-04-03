module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/docs/'
  ],
  setupFiles: ['<rootDir>/src/tests/setup.js'],
  verbose: true,
  testTimeout: 10000
}; 