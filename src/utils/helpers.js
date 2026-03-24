/**
 * Utility helpers for the MultiBank automation framework.
 */

const fs = require('fs');
const path = require('path');

/**
 * Load test data from the test-data directory.
 * @param {string} fileName - File name without extension (e.g., 'navigation')
 * @returns {object}
 */
function loadTestData(fileName) {
  const filePath = path.resolve(__dirname, '../../test-data', `${fileName}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Check whether a URL is absolute (has a protocol).
 * @param {string} href
 * @returns {boolean}
 */
function isAbsoluteUrl(href) {
  return /^https?:\/\//i.test(href);
}

/**
 * Normalize a URL against a base for comparison.
 * @param {string} href
 * @param {string} base
 * @returns {string}
 */
function normalizeUrl(href, base = 'https://trade.multibank.io') {
  if (!href) return '';
  if (isAbsoluteUrl(href)) return href;
  return `${base}${href.startsWith('/') ? '' : '/'}${href}`;
}

/**
 * Retry an async function up to maxAttempts times.
 * @param {Function} fn
 * @param {number} maxAttempts
 * @param {number} delayMs
 * @returns {Promise<any>}
 */
async function retry(fn, maxAttempts = 3, delayMs = 500) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }
  throw lastError;
}

module.exports = { loadTestData, isAbsoluteUrl, normalizeUrl, retry };
