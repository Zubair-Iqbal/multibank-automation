const { BasePage } = require('./BasePage');

/**
 * HomePage - Models the MultiBank platform landing page.
 * Covers marketing banners and download section.
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // Marketing banners at the bottom of the page
    this.banners = page.locator('[class*="banner"], [class*="promo"], [class*="hero"], section[class*="bottom"]');

    // Download section
    this.downloadSection = page.locator('[class*="download"], [class*="app-store"], section:has(a[href*="apple"]), section:has(a[href*="google"])');

    // App Store link
    this.appStoreLink = page.locator('a[href*="apps.apple.com"], a[href*="apple.com/app"]').first();

    // Google Play link
    this.googlePlayLink = page.locator('a[href*="play.google.com"]').first();
  }

  /**
   * Navigate to the homepage and dismiss overlays.
   */
  async goToHome() {
    await this.navigate('/');
    await this.acceptCookiesIfPresent();
  }

  /**
   * Check if any marketing banner is visible.
   * @returns {Promise<boolean>}
   */
  async areBannersVisible() {
    return this.banners.first().isVisible().catch(() => false);
  }

  /**
   * Scroll to and check download section visibility.
   * @returns {Promise<boolean>}
   */
  async isDownloadSectionVisible() {
    await this.scrollToBottom();
    return this.downloadSection.first().isVisible().catch(() => false);
  }

  /**
   * Get the href of the App Store link.
   * @returns {Promise<string|null>}
   */
  async getAppStoreHref() {
    await this.scrollToBottom();
    return this.appStoreLink.getAttribute('href').catch(() => null);
  }

  /**
   * Get the href of the Google Play link.
   * @returns {Promise<string|null>}
   */
  async getGooglePlayHref() {
    await this.scrollToBottom();
    return this.googlePlayLink.getAttribute('href').catch(() => null);
  }

  /**
   * Check if the App Store link is visible.
   * @returns {Promise<boolean>}
   */
  async isAppStoreLinkVisible() {
    await this.scrollToBottom();
    return this.appStoreLink.isVisible().catch(() => false);
  }

  /**
   * Check if the Google Play link is visible.
   * @returns {Promise<boolean>}
   */
  async isGooglePlayLinkVisible() {
    await this.scrollToBottom();
    return this.googlePlayLink.isVisible().catch(() => false);
  }
}

module.exports = { HomePage };
