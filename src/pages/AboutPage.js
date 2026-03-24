const { BasePage } = require('./BasePage');

/**
 * AboutPage - Models the "About Us → Why MultiBank" page.
 */
class AboutPage extends BasePage {
  constructor(page) {
    super(page);

    // Page heading / hero
    this.pageHeading = page.locator('h1, [class*="hero"] h2, [class*="heading"]').first();

    // All section headings on the page
    this.sectionHeadings = page.locator('h2, h3');

    // Content sections / cards
    this.contentSections = page.locator('section, [class*="section"], [class*="card"]');
  }

  /**
   * Navigate to the Why MultiBank page.
   * @param {string} path - relative path
   */
  async goToWhyMultiBank(path = '/why-multibank') {
    await this.navigate(path);
    await this.acceptCookiesIfPresent();
  }

  /**
   * Get the main page heading text.
   * @returns {Promise<string>}
   */
  async getPageHeading() {
    await this.pageHeading.waitFor({ state: 'visible' });
    return (await this.pageHeading.textContent() ?? '').trim();
  }

  /**
   * Get all section heading texts on the page.
   * @returns {Promise<string[]>}
   */
  async getSectionHeadings() {
    const count = await this.sectionHeadings.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.sectionHeadings.nth(i).textContent() ?? '').trim();
      if (text) texts.push(text);
    }
    return texts;
  }

  /**
   * Check if a specific text appears anywhere on the page.
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async hasText(text) {
    return this.page.locator(`text="${text}"`).isVisible().catch(() => false);
  }

  /**
   * Check if a section heading containing the given text is visible.
   * @param {string} text
   * @returns {Promise<boolean>}
   */
  async hasSectionWithText(text) {
    return this.page.locator(`h1:has-text("${text}"), h2:has-text("${text}"), h3:has-text("${text}")`).isVisible().catch(() => false);
  }

  /**
   * Get count of content sections.
   * @returns {Promise<number>}
   */
  async getContentSectionCount() {
    return this.contentSections.count();
  }
}

module.exports = { AboutPage };
