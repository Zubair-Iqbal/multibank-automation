/** @type {import('eslint').Linter.Config} */
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
    // Catch dead code before it ships
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

    // Prevent silent typos in global access
    'no-undef': 'error',

    // Enforce consistent async/await — flag missing awaits
    'no-return-await': 'error',

    // Catch accidental == vs ===
    'eqeqeq': ['error', 'always'],

    // Disallow console.log left in source (use logger instead)
    'no-console': 'warn',
  },
  ignorePatterns: [
    'node_modules/',
    'playwright-report/',
    'test-results/',
  ],
};
