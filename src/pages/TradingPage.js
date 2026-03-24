const { BasePage } = require('./BasePage');

/**
 * TradingPage - Models the spot trading section of the MultiBank platform.
 */
class TradingPage extends BasePage {
  constructor(page) {
    super(page);

    // Category tabs (e.g., All, Forex, Crypto, Stocks)
    this.categoryTabs = page.locator('[class*="tab"], [role="tab"], [class*="category"]');

    // Trading pair rows / cards in the table
    this.tradingPairRows = page.locator('[class*="pair"], [class*="symbol"], [class*="instrument"], tr[class*="row"], tbody tr');

    // Spot trading section wrapper
    this.spotSection = page.locator('[class*="spot"], [class*="market"], section').first();
  }

  /**
   * Navigate to the spot trading page.
   */
  async goToSpot() {
    await this.navigate('/');
    await this.acceptCookiesIfPresent();
  }

  /**
   * Get all visible category tab labels.
   * @returns {Promise<string[]>}
   */
  async getCategoryTabNames() {
    await this.waitForPageLoad();
    const count = await this.categoryTabs.count();
    const names = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.categoryTabs.nth(i).textContent() ?? '').trim();
      if (text) names.push(text);
    }
    return names;
  }

  /**
   * Click a category tab by name.
   * @param {string} name
   */
  async clickCategoryTab(name) {
    await this.page
      .locator(`[class*="tab"]:has-text("${name}"), [role="tab"]:has-text("${name}")`)
      .first()
      .click();
    await this.page.waitForTimeout(500);
  }

  /**
   * Get the count of visible trading pair rows.
   * @returns {Promise<number>}
   */
  async getTradingPairCount() {
    return this.tradingPairRows.count();
  }

  /**
   * Get the first N trading pair names visible on screen.
   * @param {number} [limit=5]
   * @returns {Promise<string[]>}
   */
  async getTradingPairNames(limit = 5) {
    const count = Math.min(await this.tradingPairRows.count(), limit);
    const names = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.tradingPairRows.nth(i).textContent() ?? '').trim();
      if (text) names.push(text);
    }
    return names;
  }

  /**
   * Check whether the spot section is present and visible.
   * @returns {Promise<boolean>}
   */
  async isSpotSectionVisible() {
    return this.spotSection.isVisible().catch(() => false);
  }
}

module.exports = { TradingPage };
