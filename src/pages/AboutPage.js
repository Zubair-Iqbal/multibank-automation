const { BasePage } = require('./BasePage');

/**
 * AboutPage - Models the Company / Why MultiBank page (/en-AE/company).
 *
 * The "Why MultiBank Group?" content lives at /en-AE/company (not /why-multibank).
 * Main heading: <h1>Why MultiBank Group?</h1>
 */
class AboutPage extends BasePage {
  constructor(page) {
    super(page);

    this.pageHeading      = page.locator('h1').first();
    this.sectionHeadings  = page.locator('h2, h3');
    this.allHeadings      = page.locator('h1, h2, h3');
  }

  async goToCompany() {
    await this.navigate('/en-AE/company');
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  /** @returns {Promise<string>} */
  async getPageHeading() {
    return (await this.pageHeading.textContent() ?? '').trim();
  }

  /**
   * Get all heading texts on the page.
   * @returns {Promise<string[]>}
   */
  async getAllHeadings() {
    const count = await this.allHeadings.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const t = (await this.allHeadings.nth(i).textContent() ?? '').trim();
      if (t) texts.push(t);
    }
    return texts;
  }

  /**
   * Check if any heading contains the given text (case-insensitive).
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async hasHeadingContaining(text) {
    const lc = text.toLowerCase();
    const headings = await this.getAllHeadings();
    return headings.some(h => h.toLowerCase().includes(lc));
  }

  /**
   * Check if any element on the page contains the text.
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async hasText(text) {
    return this.page.getByText(text, { exact: false }).isVisible().catch(() => false);
  }

  /** @returns {Promise<number>} */
  async getSectionHeadingCount() {
    return this.sectionHeadings.count();
  }
}

module.exports = { AboutPage };
