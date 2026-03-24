const { BasePage } = require('./BasePage');

/**
 * HomePage - Models the mb.io landing page (/en-AE).
 *
 * Hero heading:   <h3 class="gradient-text">Crypto for everyone</h3>
 * Download CTA:   <a href="https://mbio.go.link/6OW91">Download the app</a>  (hero only)
 * Register CTA:   <a href="https://trade.mb.io/register">Open an account</a>
 * Bottom sections: h3 headings below the fold
 * Footer:          <footer> > <nav aria-label="Footer">
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.heroHeading  = page.locator('h3.gradient-text').filter({ hasText: 'Crypto for everyone' });
    this.downloadLink = page.locator('a[href="https://mbio.go.link/6OW91"]').first();
    this.registerLink = page.locator('a[href="https://trade.mb.io/register"]').filter({ hasText: 'Open an account' });
    this.footerNav    = page.locator('footer nav[aria-label="Footer"]');
    this.footerLinks  = page.locator('footer nav[aria-label="Footer"] a');
  }

  async goToHome() {
    await this.navigate('/en-AE');
  }

  /** @returns {Promise<string>} */
  async getHeroHeadingText() {
    return (await this.heroHeading.textContent() ?? '').trim();
  }

  /** @returns {Promise<boolean>} */
  async isDownloadLinkVisible() {
    return this.downloadLink.isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isRegisterLinkVisible() {
    return this.registerLink.isVisible().catch(() => false);
  }

  /**
   * Click the "Download the app" CTA.
   * Note: this opens a new tab — caller is responsible for capturing it via context.waitForEvent('page').
   */
  async clickDownloadApp() {
    await this.downloadLink.click();
  }

  /**
   * Check if a bottom-page section heading is visible after scrolling.
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async isBottomSectionVisible(text) {
    await this.scrollToBottom();
    return this.page.locator('h2, h3').filter({ hasText: text }).isVisible().catch(() => false);
  }

  /**
   * Check if a footer section heading is visible.
   * @param {string} name
   * @returns {Promise<boolean>}
   */
  async isFooterSectionVisible(name) {
    await this.scrollToBottom();
    return this.page.locator(`footer h3:has-text("${name}")`).isVisible().catch(() => false);
  }

  /**
   * Get all footer link hrefs.
   * @returns {Promise<string[]>}
   */
  async getFooterLinkHrefs() {
    await this.scrollToBottom();
    const count = await this.footerLinks.count();
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const h = await this.footerLinks.nth(i).getAttribute('href');
      if (h) hrefs.push(h);
    }
    return hrefs;
  }
}

module.exports = { HomePage };
