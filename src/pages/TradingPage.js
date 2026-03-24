const { BasePage } = require('./BasePage');
const { retry } = require('../utils/helpers');
const { logger } = require('../utils/logger');

class TradingPage extends BasePage {
  constructor(page) {
    super(page);

    this.spotSectionHeading = page.locator('h2').filter({ hasText: 'Spot market' });
    this.cryptoListHeading  = page.locator('h3').filter({ hasText: "Today's top crypto prices" });
    this.tabHot     = page.getByRole('button', { name: 'Hot' });
    this.tabGainers = page.getByRole('button', { name: 'Gainers' });
    this.tabLosers  = page.getByRole('button', { name: 'Losers' });
    this.activeTab  = page.locator('button.bg-lighter');
    this.assetTable = page.locator('table');
    this.tableBody  = page.locator('tbody');
    this.assetRows  = page.locator('tbody tr[data-index]');
    this.assetLinks = page.locator('tbody tr a[href^="/explore/"]');
  }

  async goToExplore() {
    await this.navigate('/en-AE/explore');
    await this.waitForTableData();
  }

  async goToExploreAndCaptureApi() {
    logger.info('goToExploreAndCaptureApi: navigating and intercepting market data API');
    const responsePromise = this.page.waitForResponse(
      res => res.url().includes('marketdata/prices') && res.status() === 200,
      { timeout: 20000 }
    );
    await this.page.goto('/en-AE/explore');
    const response = await responsePromise;
    const marketData = await response.json();
    logger.debug('goToExploreAndCaptureApi: API response received', { count: marketData.length });
    await this.waitForTableData();
    return marketData;
  }

  async waitForTableData() {
    await retry(async () => {
      await this.assetTable.waitFor({ state: 'visible', timeout: 20000 });
      await this.assetRows.first().waitFor({ state: 'visible', timeout: 20000 });
    }, 3, 200);
  }

  async isSpotSectionVisible() {
    return this.spotSectionHeading.isVisible().catch(() => false);
  }

  async isAssetTableVisible() {
    return this.assetTable.isVisible().catch(() => false);
  }

  async getAssetRowCount() {
    return this.assetRows.count();
  }

  async getActiveTabText() {
    return (await this.activeTab.first().textContent() ?? '').trim();
  }

  async clickTab(label) {
    const tabMap = {
      Hot:     this.tabHot,
      Gainers: this.tabGainers,
      Losers:  this.tabLosers,
    };
    const responsePromise = this.page.waitForResponse(
      res => res.url().includes('marketdata/prices') && res.status() === 200,
      { timeout: 15000 }
    );
    await tabMap[label].click();
    await responsePromise;
    await this.assetRows.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async getAssetLinkHref(index = 0) {
    return this.assetLinks.nth(index).getAttribute('href').catch(() => null);
  }

  async getAssetLinkHrefs(limit = 5) {
    const count = Math.min(await this.assetLinks.count(), limit);
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await this.assetLinks.nth(i).getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }

  async getFirstAssetSymbol() {
    const href = await this.assetLinks.first().getAttribute('href');
    return href.replace('/explore/', '').trim();
  }

  async getAssetRowText(symbol) {
    const row = this.page.locator(`tbody tr:has(a[href="/explore/${symbol}"])`);
    return (await row.textContent() ?? '').replace(/\s+/g, ' ').trim();
  }
}

module.exports = { TradingPage };
