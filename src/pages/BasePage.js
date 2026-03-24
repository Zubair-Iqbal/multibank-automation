/* globals window, document */
const { logger } = require('../utils/logger');
const { config } = require('../config');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(path = '/') {
    logger.info('navigate', { path });
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForVisible(selector, timeout = config.timeouts.action) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async isVisible(selector) {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  async getText(selector) {
    return (await this.page.locator(selector).textContent() ?? '').trim();
  }

  async getHref(selector) {
    return this.page.locator(selector).getAttribute('href');
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForLoadState('domcontentloaded');
  }

  async scrollIntoView(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  getUrl() {
    return this.page.url();
  }

  async getTitle() {
    return this.page.title();
  }

  async acceptCookiesIfPresent() {
    const selectors = [
      'button:has-text("Accept")',
      'button:has-text("Accept All")',
      'button:has-text("I Agree")',
      '[data-testid="cookie-accept"]',
    ];
    for (const selector of selectors) {
      const el = this.page.locator(selector).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        break;
      }
    }
  }

  async dismissOverlayIfPresent(selector) {
    const el = this.page.locator(selector).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click();
    }
  }

  async waitForUrl(pattern, timeout = config.timeouts.navigation) {
    await this.page.waitForURL(pattern, { timeout });
  }

  async goBack(expectedPattern, timeout = config.timeouts.navigation) {
    await this.page.goBack();
    await this.page.waitForURL(expectedPattern, { timeout });
  }
}

module.exports = { BasePage };
