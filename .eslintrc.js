module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'commonjs',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'no-return-await': 'error',
    'eqeqeq': ['error', 'always'],
    'no-console': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    'playwright-report/',
    'test-results/',
  ],
};
