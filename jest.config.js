/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,

  collectCoverage: true,
  coverageDirectory: 'coverage',

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/configs/',
  ],

  coverageProvider: 'v8',

  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover',
  ],
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  preset: 'ts-jest',
  roots: [
    './tests',
  ],
  testEnvironment: 'node',
};