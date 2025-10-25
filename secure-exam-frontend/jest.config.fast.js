const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

// Fast test configuration with shorter timeouts
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/layout.tsx',
    '!**/loading.tsx',
    '!**/not-found.tsx',
    '!**/error.tsx',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  // Fast test settings
  testTimeout: 5000, // 5 second timeout
  maxWorkers: 1, // Single worker to avoid resource conflicts
  verbose: false, // Less verbose output
  bail: 1, // Stop on first failure
  passWithNoTests: true,
}

module.exports = createJestConfig(customJestConfig)