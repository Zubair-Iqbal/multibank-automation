const { BasePage } = require('./BasePage');

/**
 * HomePage - Models the mb.io landing page (/en-AE).
 *
 * Download CTA uses a single deep-link: https://mbio.go.link/6OW91
 * (routes to Play Store / App Store based on device UA).
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Primary download CTA button (deep-link)
    this.downloadAppLink = page.locator('a[href="https://mbio.go.link/6OW91"]').first();

    // "Download the app" button text variant
    this.downloadAppButton = page.locator('[data-slot="button"]:has-text("Download the app")').first();

    // Footer nav
    this.footerNav = page.locator('nav[aria-label="Footer"]');

    // Footer links
    this.footerLinks = page.locator('nav[aria-label="Footer"] a');

    // Hero / banner — first section on the page
    this.heroBanner = page.locator('section, main > div').first();
  }

  async goToHome() {
    await this.navigate('/en-AE');
  }

  /** @returns {Promise<boolean>} */
  async isHeroBannerVisible() {
    return this.heroBanner.isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isDownloadLinkVisible() {
    await this.scrollToBottom();
    return this.downloadAppLink.isVisible().catch(() => false);
  }

  /** @returns {Promise<string|null>} */
  async getDownloadAppHref() {
    await this.scrollToBottom();
    return this.downloadAppLink.getAttribute('href').catch(() => null);
  }

  /** @returns {Promise<boolean>} */
  async isFooterVisible() {
    await this.scrollToBottom();
    return this.footerNav.isVisible().catch(() => false);
  }

  /** @returns {Promise<number>} */
  async getFooterLinkCount() {
    await this.scrollToBottom();
    return this.footerLinks.count();
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
