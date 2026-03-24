/**
 * Trading Functionality Tests — Part 3
 *
 * Validates the Spot Market section on /en-AE/explore:
 *  - Section and table visibility
 *  - Category tabs (Hot / Gainers / Losers) presence and interaction
 *  - Asset row data structure and API-backed price/change validation
 *
 * Test data: test-data/trading.json (no hard-coded values in assertions)
 */

const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('trading');

// ─────────────────────────────────────────────────────────────
// Suite 1 — Spot Market Section Visibility
// ─────────────────────────────────────────────────────────────
test.describe('Spot Market Section', () => {
  test.beforeEach(async ({ tradingPage }) => {
    await tradingPage.goToExplore();
  });

  test('spot market section heading is visible', async ({ tradingPage }) => {
    expect(await tradingPage.isSpotSectionVisible()).toBe(true);
  });

  test('asset table is visible and rendered', async ({ tradingPage }) => {
    expect(await tradingPage.isAssetTableVisible()).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────
// Suite 2 — Category Tabs
// ─────────────────────────────────────────────────────────────
test.describe('Category Tabs', () => {
  test.beforeEach(async ({ tradingPage }) => {
    await tradingPage.goToExplore();
  });

  test('"Hot" tab is active by default', async ({ tradingPage }) => {
    const activeText = await tradingPage.getActiveTabText();
    expect(activeText).toBe('Hot');
  });

  test('clicking "Gainers" tab makes it active', async ({ tradingPage }) => {
    await tradingPage.clickTab('Gainers');
    const activeText = await tradingPage.getActiveTabText();
    expect(activeText).toBe('Gainers');
  });

  test('clicking "Losers" tab makes it active', async ({ tradingPage }) => {
    await tradingPage.clickTab('Losers');
    const activeText = await tradingPage.getActiveTabText();
    expect(activeText).toBe('Losers');
  });

  test('switching tabs still shows asset rows', async ({ tradingPage }) => {
    await tradingPage.clickTab('Losers');
    const count = await tradingPage.getAssetRowCount();
    expect(count).toBeGreaterThanOrEqual(data.minAssetRowCount);
  });

  test('each category tab displays trading pairs', async ({ tradingPage }) => {
    for (const tab of data.categories) {
      await tradingPage.clickTab(tab);
      const count = await tradingPage.getAssetRowCount();
      expect(count, `Expected rows after clicking "${tab}" tab`).toBeGreaterThan(0);
    }
  });

  test('different tabs display different trading pairs', async ({ tradingPage }) => {
    await tradingPage.clickTab('Gainers');
    const gainersFirst = await tradingPage.getFirstAssetSymbol();

    await tradingPage.clickTab('Losers');
    const losersFirst = await tradingPage.getFirstAssetSymbol();

    expect(gainersFirst).not.toBe(losersFirst);
  });
});

// ─────────────────────────────────────────────────────────────
// Suite 3 — Asset Data Structure
// ─────────────────────────────────────────────────────────────
test.describe('Asset Data Structure', () => {
  test.beforeEach(async ({ tradingPage }) => {
    await tradingPage.goToExplore();
  });

  test('each asset row links to a detail page', async ({ tradingPage }) => {
    const href = await tradingPage.getAssetLinkHref(0);
    expect(href).toBeTruthy();
    expect(href).toContain(data.assetDetailPathPrefix);
  });

  test('asset detail links follow the /explore/{SYMBOL} pattern', async ({ tradingPage }) => {
    const hrefs = await tradingPage.getAssetLinkHrefs(5);
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toMatch(/^\/explore\/[A-Z0-9]+$/);
    }
  });

  test('displayed price matches the market data API response', async ({ tradingPage }) => {
    const marketData = await tradingPage.goToExploreAndCaptureApi();
    const symbol = await tradingPage.getFirstAssetSymbol();

    const apiEntry = marketData.find(d => d.base === symbol);
    expect(apiEntry, `Symbol "${symbol}" not found in API response`).toBeTruthy();

    // API: close = 71191.39 → UI shows "$71,191.39"
    // Strip commas from row text and check the integer part is present
    const rowText = await tradingPage.getAssetRowText(symbol);
    const rowTextNormalized = rowText.replace(/,/g, '');
    const priceIntPart = String(Math.floor(apiEntry.close));
    expect(rowTextNormalized).toContain(priceIntPart);
  });

  test('displayed change percentage matches the market data API response', async ({ tradingPage }) => {
    const marketData = await tradingPage.goToExploreAndCaptureApi();
    const symbol = await tradingPage.getFirstAssetSymbol();

    const apiEntry = marketData.find(d => d.base === symbol);
    expect(apiEntry, `Symbol "${symbol}" not found in API response`).toBeTruthy();

    // API: changePercentFormatted = "-8.65" → UI shows "8.65%" (minus stripped; direction shown via color/arrow)
    const rowText = await tradingPage.getAssetRowText(symbol);
    const changeAbs = apiEntry.changePercentFormatted.replace('-', '');
    expect(rowText).toContain(changeAbs);
  });
});
