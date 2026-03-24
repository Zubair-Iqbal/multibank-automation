const { BasePage } = require('./BasePage');

/**
 * TradingPage - Models the Explore / Spot Market section of mb.io.
 *
 * Located at /en-AE/explore.
 * Category tabs: Hot | Gainers | Losers  (role="tab" or data-slot="tab")
 * Asset cards rendered via React Query after JS hydration.
 */
class TradingPage extends BasePage {
  constructor(page) {
    super(page);

    // Section heading "Today's top crypto prices"
    this.spotSectionHeading = page.locator('text="Today\'s top crypto prices"');

    // Category tabs — Playwright matches role=tab or common tab implementations
    this.categoryTabs = page.locator('[role="tab"], [data-slot="tab"], [data-state]');

    // Individual asset rows / cards — loaded after hydration
    this.assetCards = page.locator('[data-slot="card"], [class*="card"], [class*="asset"], [class*="row"]');

    // Loading skeleton — wait for it to disappear before asserting data
    this.skeleton = page.locator('[data-slot="skeleton"]');
  }

  async goToExplore() {
    await this.navigate('/en-AE/explore');
    await this.waitForHydration();
  }

  /**
   * Wait for skeleton loaders to disappear (data has loaded).
   */
  async waitForHydration() {
    await this.page.waitForLoadState('domcontentloaded');
    // Give React time to hydrate and fetch data
    await this.page.waitForFunction(() => {
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      return skeletons.length === 0;
    }, { timeout: 15000 }).catch(() => {
      // Skeletons may not disappear fully — proceed anyway
    });
  }

  /** @returns {Promise<boolean>} */
  async isSpotSectionVisible() {
    return this.spotSectionHeading.isVisible().catch(() => false);
  }

  /**
   * Get visible category tab labels.
   * @returns {Promise<string[]>}
   */
  async getCategoryTabNames() {
    const count = await this.categoryTabs.count();
    const names = [];
    for (let i = 0; i < count; i++) {
      const t = (await this.categoryTabs.nth(i).textContent() ?? '').trim();
      if (t) names.push(t);
    }
    return names;
  }

  /**
   * Click a category tab by label.
   * @param {string} label
   */
  async clickCategoryTab(label) {
    await this.page.locator(`[role="tab"]:has-text("${label}"), [data-slot="tab"]:has-text("${label}")`).first().click();
    await this.page.waitForTimeout(800);
  }

  /** @returns {Promise<number>} */
  async getAssetCardCount() {
    return this.assetCards.count();
  }
}

module.exports = { TradingPage };
