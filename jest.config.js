module.exports = { // eslint-disable-line no-undef
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
