const { BasePage } = require('./BasePage');

class NavigationPage extends BasePage {
  constructor(page) {
    super(page);

    this.header        = page.locator('header.sticky');
    this.mainNav       = page.locator('nav[aria-label="Main"]');
    this.mainNavLinks  = page.locator('nav[aria-label="Main"] a');
    this.logo          = page.locator('header a').first();
    this.signInLink    = page.locator('header a:has-text("Sign in"), header a:has-text("Sign In")').first();
    this.signUpLink    = page.locator('header a:has-text("Sign up"), header a:has-text("Sign Up")').first();
    this.exploreLink   = page.locator('nav[aria-label="Main"] a[href="/en-AE/explore"]');
    this.featuresLink  = page.locator('nav[aria-label="Main"] a[href="/en-AE/features"]');
    this.companyLink   = page.locator('nav[aria-label="Main"] a[href="/en-AE/company"]');

    this.mobileMenuButton = page.locator('button[aria-label="Open menu"]');
    this.mobileMenuDialog = page.locator('[role="dialog"]');
    this.mobileMenuClose  = page.locator('button[aria-label="Close menu"]');
    this.mobileMenuLinks  = page.locator('[role="dialog"] nav a');
  }

  async goToHome() {
    await this.navigate('/en-AE');
  }

  async getLogoHref() {
    return this.logo.getAttribute('href');
  }

  async clickExplore(expectedRoute) {
    await this.exploreLink.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  async clickFeatures(expectedRoute) {
    await this.featuresLink.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  async clickCompany(expectedRoute) {
    await this.companyLink.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  async isHeaderVisible() {
    return this.header.isVisible();
  }

  async isMainNavVisible() {
    return this.mainNav.isVisible();
  }

  async isLogoVisible() {
    await this.header.waitFor({ state: 'visible' });
    return this.logo.isVisible().catch(() => false);
  }

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

  async getMainNavLinkCount() {
    return this.mainNavLinks.count();
  }

  async clickNavLink(label, expectedRoute) {
    await this.page.locator(`nav[aria-label="Main"] a:has-text("${label}")`).first().click();
    await this.waitForUrl(`**${expectedRoute}`);
  }

  async isSignInVisible() {
    return this.signInLink.isVisible().catch(() => false);
  }

  async isSignUpVisible() {
    return this.signUpLink.isVisible().catch(() => false);
  }

  async isMobileMenuButtonVisible() {
    return this.mobileMenuButton.isVisible().catch(() => false);
  }

  async openMobileMenu() {
    await this.mobileMenuButton.click();
    await this.mobileMenuDialog.waitFor({ state: 'visible', timeout: 10000 });
  }

  async isMobileMenuOpen() {
    return this.mobileMenuDialog.isVisible().catch(() => false);
  }

  async closeMobileMenu() {
    await this.mobileMenuClose.click();
    await this.mobileMenuDialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

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

  async clickMobileMenuLink(href, expectedRoute) {
    await this.page.locator(`[role="dialog"] nav a[href="${href}"]`).click();
    await this.waitForUrl(`**${expectedRoute}`);
  }
}

module.exports = { NavigationPage };
