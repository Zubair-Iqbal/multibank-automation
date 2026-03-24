const fs = require('fs');
const path = require('path');
const { logger } = require('./logger');

function loadTestData(fileName) {
  const filePath = path.resolve(__dirname, '../../test-data', `${fileName}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

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

module.exports = { loadTestData, retry };
