const { BasePage } = require('./BasePage');

/**
 * TradingPage - Models the Spot Market section on /en-AE/explore.
 *
 * Real DOM structure:
 *  - Section heading: <h2>Spot market</h2>
 *  - Crypto price list heading: <h3>Today's top crypto prices</h3> (desktop only)
 *  - Category tabs: plain <button> elements (no role="tab")
 *    Active tab has classes: bg-lighter + text-white
 *  - Asset table: TanStack virtual table
 *    Rows: tbody tr[data-index]
 *    Asset links: tbody tr a[href^="/explore/"]
 *    Columns: Asset | Price | 24h Change | Last 7 days
 */
class TradingPage extends BasePage {
  constructor(page) {
    super(page);

    // Spot market section heading
    this.spotSectionHeading = page.locator('h2').filter({ hasText: 'Spot market' });

    // Crypto price list heading (visible on desktop viewport only)
    this.cryptoListHeading = page.locator('h3').filter({ hasText: "Today's top crypto prices" });

    // Category tab buttons (Hot / Gainers / Losers)
    this.tabHot     = page.getByRole('button', { name: 'Hot' });
    this.tabGainers = page.getByRole('button', { name: 'Gainers' });
    this.tabLosers  = page.getByRole('button', { name: 'Losers' });

    // Active tab — has bg-lighter class applied
    this.activeTab = page.locator('button.bg-lighter');

    // Asset table
    this.assetTable = page.locator('table');
    this.tableBody  = page.locator('tbody');

    // Asset rows — TanStack Virtual adds data-index to each row
    this.assetRows = page.locator('tbody tr[data-index]');

    // Asset detail links inside rows (href="/explore/{SYMBOL}")
    this.assetLinks = page.locator('tbody tr a[href^="/explore/"]');

    // Table column definitions via data-header-column-id (thead is visually hidden)
    this.tableColumnDefs = page.locator('thead th[data-header-column-id]');
  }

  async goToExplore() {
    await this.navigate('/en-AE/explore');
    await this.waitForTableData();
  }

  /**
   * Navigate to explore page and simultaneously capture the market data API response.
   * API: GET /api/io/v1/marketdata/prices?quote=USDT
   * Returns array of { base, close, closeFormatted, changePercent, changePercentFormatted, ... }
   * @returns {Promise<Array>} raw market data array from the API
   */
  async goToExploreAndCaptureApi() {
    const responsePromise = this.page.waitForResponse(
      res => res.url().includes('marketdata/prices') && res.status() === 200,
      { timeout: 20000 }
    );
    await this.page.goto('/en-AE/explore');
    const response = await responsePromise;
    const marketData = await response.json();
    await this.waitForTableData();
    return marketData;
  }

  /**
   * Wait for virtual table rows to be rendered (data loaded from API).
   */
  async waitForTableData() {
    await this.assetTable.waitFor({ state: 'visible', timeout: 20000 });
    await this.assetRows.first().waitFor({ state: 'visible', timeout: 20000 });
  }

  /** @returns {Promise<boolean>} */
  async isSpotSectionVisible() {
    return this.spotSectionHeading.isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isAssetTableVisible() {
    return this.assetTable.isVisible().catch(() => false);
  }

  /** @returns {Promise<number>} */
  async getAssetRowCount() {
    return this.assetRows.count();
  }

  /**
   * Get the text of the currently active tab.
   * @returns {Promise<string>}
   */
  async getActiveTabText() {
    return (await this.activeTab.first().textContent() ?? '').trim();
  }

  /**
   * Click a category tab and wait for rows to reload.
   * @param {'Hot'|'Gainers'|'Losers'} label
   */
  async clickTab(label) {
    const tabMap = {
      Hot:     this.tabHot,
      Gainers: this.tabGainers,
      Losers:  this.tabLosers,
    };
    await tabMap[label].click();
    // Wait briefly for the virtual table to re-render with new data
    await this.page.waitForTimeout(800);
    await this.assetRows.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get the href of the Nth asset row link.
   * @param {number} index
   * @returns {Promise<string|null>}
   */
  async getAssetLinkHref(index = 0) {
    return this.assetLinks.nth(index).getAttribute('href').catch(() => null);
  }

  /**
   * Get all asset link hrefs up to a given limit.
   * Replaces direct assetLinks.count() + assetLinks.nth(i) access in tests.
   * @param {number} [limit=5]
   * @returns {Promise<string[]>}
   */
  async getAssetLinkHrefs(limit = 5) {
    const count = Math.min(await this.assetLinks.count(), limit);
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await this.assetLinks.nth(i).getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }

  /** @returns {Promise<boolean>} */
  async isSpotSectionVisible() {
    return this.spotSectionHeading.isVisible().catch(() => false);
  }

  /**
   * Get the symbol (base currency) of the first visible asset row.
   * Derived from the row's link href: /explore/BTC → "BTC"
   * @returns {Promise<string>}
   */
  async getFirstAssetSymbol() {
    const href = await this.assetLinks.first().getAttribute('href');
    return href.replace('/explore/', '').trim();
  }

  /**
   * Get the full text content of the row for a given asset symbol.
   * Used to verify price and change % displayed in the UI.
   * @param {string} symbol - e.g. "BTC"
   * @returns {Promise<string>}
   */
  async getAssetRowText(symbol) {
    const row = this.page.locator(`tbody tr:has(a[href="/explore/${symbol}"])`);
    return (await row.textContent() ?? '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Get all data-header-column-id attribute values from thead.
   * The thead is visually hidden but present in the DOM for structure validation.
   * @returns {Promise<string[]>}
   */
  async getTableColumnIds() {
    const count = await this.tableColumnDefs.count();
    const ids = [];
    for (let i = 0; i < count; i++) {
      const id = await this.tableColumnDefs.nth(i).getAttribute('data-header-column-id');
      if (id) ids.push(id);
    }
    return ids;
  }

  /**
   * Check if a specific tab button is visible.
   * @param {'Hot'|'Gainers'|'Losers'} label
   * @returns {Promise<boolean>}
   */
  async isTabVisible(label) {
    return this.page.getByRole('button', { name: label }).isVisible().catch(() => false);
  }
}

module.exports = { TradingPage };
