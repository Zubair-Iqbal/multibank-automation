/**
 * Trading Functionality Tests
 * Validates spot trading section, pairs, and category tabs.
 * Part 3 of the MultiBank automation framework.
 */

const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('trading');

test.describe('Trading Functionality', () => {
  test.beforeEach(async ({ tradingPage }) => {
    await tradingPage.goToSpot();
  });

  test('spot trading section is visible', async ({ tradingPage }) => {
    expect(await tradingPage.isSpotSectionVisible()).toBe(true);
  });

  test('trading pairs are displayed', async ({ tradingPage }) => {
    const count = await tradingPage.getTradingPairCount();
    expect(count).toBeGreaterThanOrEqual(data.minPairCount);
  });
});
