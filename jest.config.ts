/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  moduleNameMapper: {
    '@pages': ['<rootDir>/src/pages'],
    '@components': ['<rootDir>/src/components'],
    '@ui': ['<rootDir>/src/components/ui'],
    '@ui-pages': ['<rootDir>/src/components/ui/pages'],
    '@utils-types': ['<rootDir>/src/utils/types'],
    '@api': ['<rootDir>/src/utils/burger-api.ts'],
    '@slices': ['<rootDir>/src/services/slices'],
    '@selectors': ['<rootDir>/src/services/selectors']
  }
};

export default config;
