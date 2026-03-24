const { BasePage } = require('./BasePage');

class AboutPage extends BasePage {
  constructor(page) {
    super(page);

    this.pageH1     = page.locator('h1').filter({ hasText: 'Why MultiBank Group?' });
    this.getInTouch = page.locator('a[href="/en-AE/support/contact-us"]').filter({ hasText: 'Get in touch' });
  }

  async goToCompany() {
    await this.navigate('/en-AE/company');
    await this.pageH1.waitFor({ state: 'visible', timeout: 15000 });
  }

  async isStatVisible(stat) {
    return this.page.getByText(stat, { exact: false }).isVisible().catch(() => false);
  }

  async isH2SectionVisible(text) {
    return this.page.locator('h2').filter({ hasText: text }).isVisible().catch(() => false);
  }

  async isH3SectionVisible(text) {
    return this.page.locator('h3').filter({ hasText: text }).isVisible().catch(() => false);
  }

  async isPillarCardVisible(title) {
    return this.page.locator('span').filter({ hasText: title }).isVisible().catch(() => false);
  }

  async isPageHeadingVisible() {
    return this.pageH1.isVisible().catch(() => false);
  }

  async clickGetInTouch(expectedRoute) {
    await this.getInTouch.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }
}

module.exports = { AboutPage };
