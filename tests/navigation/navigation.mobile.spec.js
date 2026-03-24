const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('navigation');

test.use({ viewport: data.mobileViewport });

test.describe('Mobile Navigation', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.goToHome();
  });

  test('header is visible on mobile viewport', async ({ navigationPage }) => {
    expect(await navigationPage.isHeaderVisible()).toBe(true);
  });

  test('desktop main nav is hidden on mobile viewport', async ({ navigationPage }) => {
    expect(await navigationPage.isMainNavVisible()).toBe(false);
  });

  test('hamburger menu button is visible on mobile viewport', async ({ navigationPage }) => {
    expect(await navigationPage.isMobileMenuButtonVisible()).toBe(true);
  });

  test('opening the mobile menu shows the navigation dialog', async ({ navigationPage }) => {
    await navigationPage.openMobileMenu();
    expect(await navigationPage.isMobileMenuOpen()).toBe(true);
  });

  test('mobile menu contains internal navigation links', async ({ navigationPage }) => {
    await navigationPage.openMobileMenu();
    const hrefs = await navigationPage.getMobileMenuLinkHrefs();
    expect(hrefs.length).toBeGreaterThan(0);
    const internalLinks = hrefs.filter(h => h.startsWith(data.mobileMenuNavLinkPrefix));
    expect(internalLinks.length).toBeGreaterThan(0);
  });

  test('closing the mobile menu hides the navigation dialog', async ({ navigationPage }) => {
    await navigationPage.openMobileMenu();
    await navigationPage.closeMobileMenu();
    expect(await navigationPage.isMobileMenuOpen()).toBe(false);
  });

  test('tapping a mobile menu link navigates to the explore page', async ({ navigationPage }) => {
    await navigationPage.openMobileMenu();
    const hrefs = await navigationPage.getMobileMenuLinkHrefs();
    const exploreHref = hrefs.find(h => h.includes('/explore'));
    expect(exploreHref).toBeTruthy();
    await navigationPage.clickMobileMenuLink(exploreHref, data.routes.explore);
    expect(navigationPage.getUrl()).toContain(data.routes.explore);
  });
});
