/**
 * BasePage - Foundation class for all Page Objects.
 * Provides shared navigation, waiting utilities, and element helpers.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL relative to baseURL or absolute.
   * @param {string} path
   */
  async navigate(path = '/') {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * Wait for the network to be idle and DOM to be ready.
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for an element to be visible.
   * @param {string} selector
   * @param {number} [timeout]
   */
  async waitForVisible(selector, timeout = 15000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Check whether an element exists and is visible.
   * @param {string} selector
   * @returns {Promise<boolean>}
   */
  async isVisible(selector) {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get trimmed text content of an element.
   * @param {string} selector
   * @returns {Promise<string>}
   */
  async getText(selector) {
    return (await this.page.locator(selector).textContent() ?? '').trim();
  }

  /**
   * Get the href attribute of an element.
   * @param {string} selector
   * @returns {Promise<string|null>}
   */
  async getHref(selector) {
    return this.page.locator(selector).getAttribute('href');
  }

  /**
   * Scroll to the bottom of the page.
   */
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(500);
  }

  /**
   * Scroll element into view.
   * @param {string} selector
   */
  async scrollIntoView(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Get the current page URL.
   * @returns {string}
   */
  getUrl() {
    return this.page.url();
  }

  /**
   * Get page title.
   * @returns {Promise<string>}
   */
  async getTitle() {
    return this.page.title();
  }

  /**
   * Accept cookie consent banner if present.
   */
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

  /**
   * Dismiss any modal or overlay if present.
   * @param {string} selector
   */
  async dismissOverlayIfPresent(selector) {
    const el = this.page.locator(selector).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click();
    }
  }

  /**
   * Wait for the page URL to match a pattern.
   * Encapsulates page.waitForURL so tests never access this.page directly.
   * @param {string|RegExp} pattern
   * @param {number} [timeout]
   */
  async waitForUrl(pattern, timeout = 15000) {
    await this.page.waitForURL(pattern, { timeout });
  }

  /**
   * Navigate back in browser history and wait for a URL pattern.
   * @param {string|RegExp} expectedPattern
   * @param {number} [timeout]
   */
  async goBack(expectedPattern, timeout = 15000) {
    await this.page.goBack();
    await this.page.waitForURL(expectedPattern, { timeout });
  }
}

module.exports = { BasePage };
