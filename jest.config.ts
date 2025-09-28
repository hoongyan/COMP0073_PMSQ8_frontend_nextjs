import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', 
  },
  testMatch: [
    '<rootDir>/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/tests/**/*.[jt]s?(x)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default createJestConfig(config);