const { BasePage } = require('./BasePage');

/**
 * AboutPage - Models the Company / Why MultiBank page (/en-AE/company).
 *
 * H1:   "Why MultiBank Group?"
 * Stats: "$2 trillion" | "2,000,000+" | "25+" | "2005"
 * H2s:  "A tradition of global leadership" | "Innovation with purpose" | "Integrity built into every decision"
 * H3s:  "The strength behind MultiBank Group" | "Community & Media"
 * Cards: "Regulation at our core" | "Proven track record" | "Secure & trusted"
 * CTA:  <a href="/en-AE/support/contact-us">Get in touch</a>
 */
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

  /** @returns {Promise<boolean>} */
  async isStatVisible(stat) {
    return this.page.getByText(stat, { exact: false }).isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isH2SectionVisible(text) {
    return this.page.locator('h2').filter({ hasText: text }).isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isH3SectionVisible(text) {
    return this.page.locator('h3').filter({ hasText: text }).isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isPillarCardVisible(title) {
    return this.page.locator('span').filter({ hasText: title }).isVisible().catch(() => false);
  }

  /** @returns {Promise<boolean>} */
  async isPageHeadingVisible() {
    return this.pageH1.isVisible().catch(() => false);
  }

  /**
   * Click the "Get in touch" CTA and wait for navigation to the contact page.
   * @param {string} expectedRoute - e.g. '/en-AE/support/contact-us'
   */
  async clickGetInTouch(expectedRoute) {
    await this.getInTouch.click();
    await this.waitForUrl(`**${expectedRoute}`);
  }
}

module.exports = { AboutPage };
