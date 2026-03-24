const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('navigation');

test.describe('Header & Navigation Structure', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.goToHome();
  });

  test('sticky header is visible on the homepage', async ({ navigationPage }) => {
    expect(await navigationPage.isHeaderVisible()).toBe(true);
  });

  test('main navigation element is present', async ({ navigationPage }) => {
    expect(await navigationPage.isMainNavVisible()).toBe(true);
  });

  test('logo (home link) is visible in the header', async ({ navigationPage }) => {
    expect(await navigationPage.isLogoVisible()).toBe(true);
  });

  test('logo links back to the home or root page', async ({ navigationPage }) => {
    const href = await navigationPage.getLogoHref();
    expect(href).toMatch(new RegExp(data.logoHrefPattern));
  });
});

test.describe('Navigation Routing', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.goToHome();
  });

  for (const { text, href } of data.mainNavItems) {
    test(`clicking "${text}" navigates to the correct page`, async ({ navigationPage }) => {
      await navigationPage.clickNavLink(text, href);
      expect(navigationPage.getUrl()).toContain(href);
    });
  }

  test('navigating back from a sub-page returns to home', async ({ navigationPage }) => {
    await navigationPage.clickExplore(data.routes.explore);
    await navigationPage.goBack('**/en-AE');
    expect(navigationPage.getUrl()).toContain('/en-AE');
  });

  test('header remains visible after navigating to Explore page', async ({ navigationPage }) => {
    await navigationPage.clickExplore(data.routes.explore);
    expect(await navigationPage.isHeaderVisible()).toBe(true);
  });
});
