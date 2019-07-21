module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/tests/*test.js'
  ],
  transformIgnorePatterns: ['<rootDir>/node_modules/']
};