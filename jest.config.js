// jest.config.js
module.exports = {
  testEnvironment: 'jsdom', // Use jsdom for testing React components
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // If you are using TypeScript
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node']
};