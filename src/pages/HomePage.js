const { BasePage } = require('./BasePage');

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

  async getHeroHeadingText() {
    return (await this.heroHeading.textContent() ?? '').trim();
  }

  async isDownloadLinkVisible() {
    return this.downloadLink.isVisible().catch(() => false);
  }

  async isRegisterLinkVisible() {
    return this.registerLink.isVisible().catch(() => false);
  }

  async clickDownloadApp() {
    await this.downloadLink.click();
  }

  async isBottomSectionVisible(text) {
    await this.scrollToBottom();
    return this.page.locator('h2, h3').filter({ hasText: text }).isVisible().catch(() => false);
  }

  async isFooterSectionVisible(name) {
    await this.scrollToBottom();
    return this.page.locator(`footer h3:has-text("${name}")`).isVisible().catch(() => false);
  }

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
