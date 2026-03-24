/**
 * Utility helpers for the MultiBank automation framework.
 */

const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

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
function normalizeUrl(href, base = 'https://mb.io') {
  if (!href) return '';
  if (isAbsoluteUrl(href)) return href;
  return `${base}${href.startsWith('/') ? '' : '/'}${href}`;
}

/**
 * Retry an async function with exponential backoff.
 * Delay after attempt N = baseDelayMs * 2^(N-1)  (e.g. 200 → 400 → 800 ms)
 * @param {Function} fn           - Async function to retry
 * @param {number}   maxAttempts  - Maximum number of attempts (default 3)
 * @param {number}   baseDelayMs  - Initial delay in ms; doubles each retry (default 200)
 * @returns {Promise<any>}
 */
async function retry(fn, maxAttempts = 3, baseDelayMs = 200) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        logger.warn('retry: attempt failed, retrying', { attempt, maxAttempts, delay, error: err.message });
        await new Promise((res) => setTimeout(res, delay));
      } else {
        logger.error('retry: all attempts exhausted', { maxAttempts, error: err.message });
      }
    }
  }
  throw lastError;
}

module.exports = { loadTestData, isAbsoluteUrl, normalizeUrl, retry };
