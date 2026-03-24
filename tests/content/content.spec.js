/**
 * Content Validation Tests — Part 4
 *
 * Validates:
 *  1. Homepage hero banner and bottom-page marketing sections
 *  2. Download CTA redirect to App Store / Google Play
 *  3. Footer structure and legal links
 *  4. Why MultiBank (Company) page — heading, stats, sections, pillar cards, CTA
 *
 * Test data: test-data/content.json (no hard-coded values in assertions)
 */

const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('content');

// ─────────────────────────────────────────────────────────────
// Suite 1 — Homepage Banners
// ─────────────────────────────────────────────────────────────
test.describe('Homepage Banners', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goToHome();
  });

  test('hero section renders with correct heading and CTAs', async ({ homePage }) => {
    await expect(homePage.heroHeading).toHaveText(data.heroHeading);
    await expect(homePage.downloadLink).toBeVisible();
    await expect(homePage.registerLink).toBeVisible();
  });

  test('bottom-page marketing sections are all visible', async ({ homePage }) => {
    for (const section of data.bottomSections) {
      expect(
        await homePage.isBottomSectionVisible(section),
        `Expected bottom section "${section}" to be visible`
      ).toBe(true);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// Suite 2 — Download Section
// ─────────────────────────────────────────────────────────────
test.describe('Download Section', () => {
  test('clicking "Download the app" redirects to App Store or Google Play', async ({ homePage, context }) => {
    await homePage.goToHome();
    // Deep-link opens the store in a new tab
    const [storePage] = await Promise.all([
      context.waitForEvent('page', { timeout: 20000 }),
      homePage.downloadLink.click(),
    ]);
    await storePage.waitForLoadState('domcontentloaded');
    expect(storePage.url()).toMatch(/play\.google\.com|apps\.apple\.com/);
  });
});

// ─────────────────────────────────────────────────────────────
// Suite 3 — Footer
// ─────────────────────────────────────────────────────────────
test.describe('Footer', () => {
  test('footer renders with expected sections and legal links', async ({ homePage }) => {
    await homePage.goToHome();

    // Both section headings present
    for (const section of data.footerSections) {
      expect(
        await homePage.isFooterSectionVisible(section),
        `Footer section "${section}" not found`
      ).toBe(true);
    }

    // All expected legal links present with correct hrefs
    const hrefs = await homePage.getFooterLinkHrefs();
    for (const link of data.footerLegalLinks) {
      expect(hrefs, `Footer link "${link.text}" with href "${link.href}" not found`).toContain(link.href);
    }
  });
});

// ─────────────────────────────────────────────────────────────
// Suite 4 — Why MultiBank (Company) Page
// ─────────────────────────────────────────────────────────────
test.describe('Why MultiBank — Company Page', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.goToCompany();
  });

  test('page heading and all key statistics are present', async ({ aboutPage }) => {
    await expect(aboutPage.pageH1).toBeVisible();
    for (const stat of data.companyStats) {
      expect(
        await aboutPage.isStatVisible(stat),
        `Stat "${stat}" not found on company page`
      ).toBe(true);
    }
  });

  test('all section headings are rendered', async ({ aboutPage }) => {
    for (const heading of data.companyH2Sections) {
      expect(
        await aboutPage.isH2SectionVisible(heading),
        `H2 "${heading}" not found`
      ).toBe(true);
    }
    for (const heading of data.companyH3Sections) {
      expect(
        await aboutPage.isH3SectionVisible(heading),
        `H3 "${heading}" not found`
      ).toBe(true);
    }
  });

  test('all trust pillar cards are visible', async ({ aboutPage }) => {
    for (const card of data.companyPillarCards) {
      expect(
        await aboutPage.isPillarCardVisible(card),
        `Pillar card "${card}" not found`
      ).toBe(true);
    }
  });

  test('clicking "Get in touch" navigates to the contact page', async ({ aboutPage, page }) => {
    await aboutPage.getInTouch.click();
    await page.waitForURL(`**${data.contactUsHref}`, { timeout: 15000 });
    expect(page.url()).toContain(data.contactUsHref);
  });
});
