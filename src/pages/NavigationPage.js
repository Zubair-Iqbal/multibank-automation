const { BasePage } = require('./BasePage');

/**
 * NavigationPage - Models the top navigation menu of the MultiBank trading platform.
 */
class NavigationPage extends BasePage {
  constructor(page) {
    super(page);

    // Top-level nav container
    this.navContainer = page.locator('header, nav').first();

    // Nav links — broad selector to capture all anchor tags in nav
    this.navLinks = page.locator('header a, nav a');

    // Logo
    this.logo = page.locator('header img, nav img, .logo, [class*="logo"]').first();
  }

  /**
   * Navigate to the homepage.
   */
  async goToHome() {
    await this.navigate('/');
    await this.acceptCookiesIfPresent();
  }

  /**
   * Get all visible nav link texts.
   * @returns {Promise<string[]>}
   */
  async getNavLinkTexts() {
    await this.navLinks.first().waitFor({ state: 'visible' });
    const count = await this.navLinks.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.navLinks.nth(i).textContent() ?? '').trim();
      if (text) texts.push(text);
    }
    return texts;
  }

  /**
   * Get all visible nav link hrefs.
   * @returns {Promise<string[]>}
   */
  async getNavLinkHrefs() {
    await this.navLinks.first().waitFor({ state: 'visible' });
    const count = await this.navLinks.count();
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await this.navLinks.nth(i).getAttribute('href');
      if (href) hrefs.push(href);
    }
    return hrefs;
  }

  /**
   * Click a nav item by its visible text.
   * @param {string} text
   */
  async clickNavItem(text) {
    await this.page.locator(`header a:has-text("${text}"), nav a:has-text("${text}")`).first().click();
    await this.waitForPageLoad();
  }

  /**
   * Check if the nav container is visible.
   * @returns {Promise<boolean>}
   */
  async isNavVisible() {
    return this.navContainer.isVisible();
  }

  /**
   * Check if the logo is visible.
   * @returns {Promise<boolean>}
   */
  async isLogoVisible() {
    return this.logo.isVisible().catch(() => false);
  }

  /**
   * Get count of nav links.
   * @returns {Promise<number>}
   */
  async getNavLinkCount() {
    return this.navLinks.count();
  }
}

module.exports = { NavigationPage };
