const { BasePage } = require('./BasePage');

/**
 * NavigationPage - Models the top navigation of mb.io.
 *
 * Actual DOM structure (desktop):
 *   <header class="sticky ...">
 *     <nav aria-label="Main">
 *       <a href="/en-AE/explore">Explore</a>
 *       <a href="/en-AE/features">Features</a>
 *       <a href="/en-AE/company">Company</a>
 *       <a href="https://token.multibankgroup.com/en">$MBG🔥</a>
 *     </nav>
 *     <a href="https://trade.mb.io/login">Sign in</a>
 *     <a href="https://trade.mb.io/register">Sign up</a>
 *   </header>
 */
class NavigationPage extends BasePage {
  constructor(page) {
    super(page);

    this.header        = page.locator('header.sticky');
    this.mainNav       = page.locator('nav[aria-label="Main"]');
    this.mainNavLinks  = page.locator('nav[aria-label="Main"] a');
    // Logo: first anchor in the header (before the nav), contains the brand SVG/image
    this.logo          = page.locator('header a').first();
    this.signInLink    = page.locator('header a:has-text("Sign in"), header a:has-text("Sign In")').first();
    this.signUpLink    = page.locator('header a:has-text("Sign up"), header a:has-text("Sign Up")').first();
    this.exploreLink   = page.locator('nav[aria-label="Main"] a[href="/en-AE/explore"]');
    this.featuresLink  = page.locator('nav[aria-label="Main"] a[href="/en-AE/features"]');
    this.companyLink   = page.locator('nav[aria-label="Main"] a[href="/en-AE/company"]');

    // Mobile-only elements
    this.mobileMenuButton = page.locator('button[aria-label="Open menu"]');
    this.mobileMenuDialog = page.locator('[role="dialog"]');
    this.mobileMenuClose  = page.locator('button[aria-label="Close menu"]');
    this.mobileMenuLinks  = page.locator('[role="dialog"] nav a');
  }

  async goToHome() {
    await this.navigate('/en-AE');
  }

  /**
   * Get the logo's href attribute without exposing the locator.
   * @returns {Promise<string|null>}
   */
  async getLogoHref() {
    return this.logo.getAttribute('href');
  }

  /**
   * Click the Explore nav link and wait for the URL to update.
   * @param {string} expectedRoute - e.g. '/en-AE/explore'
   */
  async clickExplore(expectedRoute) {
    await this.exploreLink.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  /**
   * Click the Features nav link and wait for the URL to update.
   * @param {string} expectedRoute
   */
  async clickFeatures(expectedRoute) {
    await this.featuresLink.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  /**
   * Click the Company nav link and wait for the URL to update.
   * @param {string} expectedRoute
   */
  async clickCompany(expectedRoute) {
    await this.companyLink.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  /** @returns {Promise<boolean>} */
  async isHeaderVisible() {
    return this.header.isVisible();
  }

  /** @returns {Promise<boolean>} */
  async isMainNavVisible() {
    return this.mainNav.isVisible();
  }

  /** @returns {Promise<boolean>} */
  async isLogoVisible() {
    // Logo is the first anchor in the header
    await this.header.waitFor({ state: 'visible' });
    return this.logo.isVisible().catch(() => false);
  }

  /**
   * Returns visible text of each link inside the main nav.
   * @returns {Promise<string[]>}
   */
  async getMainNavTexts() {
    await this.mainNavLinks.first().waitFor({ state: 'visible' });
    const count = await this.mainNavLinks.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const t = (await this.mainNavLinks.nth(i).textContent() ?? '').trim();
      if (t) texts.push(t);
    }
    return texts;
  }

  /**
   * Returns href of each link inside the main nav.
   * @returns {Promise<string[]>}
   */
  async getMainNavHrefs() {
    await this.mainNavLinks.first().waitFor({ state: 'visible' });
    const count = await this.mainNavLinks.count();
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const h = await this.mainNavLinks.nth(i).getAttribute('href');
      if (h) hrefs.push(h);
    }
    return hrefs;
  }

  /** @returns {Promise<number>} */
  async getMainNavLinkCount() {
    return this.mainNavLinks.count();
  }

  /**
   * Click a main-nav link by its label and wait for the URL to update.
   * @param {string} label        - visible link text, e.g. 'Explore'
   * @param {string} expectedRoute - route to wait for, e.g. '/en-AE/explore'
   */
  async clickNavLink(label, expectedRoute) {
    await this.page.locator(`nav[aria-label="Main"] a:has-text("${label}")`).first().click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  /** @returns {Promise<boolean>} */
  async isSignInVisible() {
    return this.signInLink.isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isSignUpVisible() {
    return this.signUpLink.isVisible().catch(() => false);
  }

  // ── Mobile helpers ────────────────────────────────────────────

  /** @returns {Promise<boolean>} */
  async isMobileMenuButtonVisible() {
    return this.mobileMenuButton.isVisible().catch(() => false);
  }

  /**
   * Open the mobile slide-in menu and wait for the dialog to appear.
   */
  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await this.mobileMenuDialog.waitFor({ state: 'visible', timeout: 10000 });
  }

  /** @returns {Promise<boolean>} */
  async isMobileMenuOpen() {
    return this.mobileMenuDialog.isVisible().catch(() => false);
  }

  /**
   * Close the mobile menu via the close button.
   */
  async closeMobileMenu() {
    await this.mobileMenuClose.click();
    await this.mobileMenuDialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Get all href values from the mobile menu nav links.
   * @returns {Promise<string[]>}
   */
  async getMobileMenuLinkHrefs() {
    await this.mobileMenuLinks.first().waitFor({ state: 'visible', timeout: 10000 });
    const count = await this.mobileMenuLinks.count();
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const h = await this.mobileMenuLinks.nth(i).getAttribute('href');
      if (h) hrefs.push(h);
    }
    return hrefs;
  }

  /**
   * Click a link inside the mobile menu dialog by its href and wait for navigation.
   * @param {string} href      - e.g. '/en-AE/explore'
   * @param {string} expectedRoute - passed to waitForUrl
   */
  async clickMobileMenuLink(href, expectedRoute) {
    await this.page.locator(`[role="dialog"] nav a[href="${href}"]`).click();
    await this.waitForUrl(`**${expectedRoute}`);
  }
}

module.exports = { NavigationPage };
