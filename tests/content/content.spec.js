const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('content');

test.describe('Homepage Banners', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goToHome();
  });

  test('hero section renders with correct heading and CTAs', async ({ homePage }) => {
    const heading = await homePage.getHeroHeadingText();
    expect(heading).toBe(data.heroHeading);
    expect(await homePage.isDownloadLinkVisible()).toBe(true);
    expect(await homePage.isRegisterLinkVisible()).toBe(true);
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

test.describe('Download Section', () => {
  test('clicking "Download the app" redirects to App Store or Google Play', async ({ homePage, context }) => {
    await homePage.goToHome();
    const [storePage] = await Promise.all([
      context.waitForEvent('page', { timeout: 20000 }),
      homePage.clickDownloadApp(),
    ]);
    await storePage.waitForLoadState('domcontentloaded');
    expect(storePage.url()).toMatch(new RegExp(data.storeUrlPattern));
  });
});

test.describe('Footer', () => {
  test('footer renders with expected sections and legal links', async ({ homePage }) => {
    await homePage.goToHome();

    for (const section of data.footerSections) {
      expect(
        await homePage.isFooterSectionVisible(section),
        `Footer section "${section}" not found`
      ).toBe(true);
    }

    const hrefs = await homePage.getFooterLinkHrefs();
    for (const link of data.footerLegalLinks) {
      expect(hrefs, `Footer link "${link.text}" with href "${link.href}" not found`).toContain(link.href);
    }
  });
});

test.describe('Why MultiBank — Company Page', () => {
  test.beforeEach(async ({ aboutPage }) => {
    await aboutPage.goToCompany();
  });

  test('page heading and all key statistics are present', async ({ aboutPage }) => {
    expect(await aboutPage.isPageHeadingVisible()).toBe(true);
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

  test('clicking "Get in touch" navigates to the contact page', async ({ aboutPage }) => {
    await aboutPage.clickGetInTouch(data.contactUsHref);
    expect(aboutPage.getUrl()).toContain(data.contactUsHref);
  });
});
