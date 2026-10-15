import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default defineConfig(
  {
    ignores: [
      'node_modules/**', 'test-results/**', 'playwright-report/**',
      'allure-results/**', 'allure-report/**',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: false }],
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'src/pages/**/*.ts', 'src/fixtures/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-force-option': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/expect-expect': ['error', {
        assertFunctionPatterns: ['^expect[A-Z]'],
      }],
    },
    settings: { playwright: { globalAliases: { test: ['base'] } } },
  },
  {
    files: ['src/fixtures/**/*.ts'],
    rules: { 'playwright/no-conditional-in-test': 'off' },
  },
);
