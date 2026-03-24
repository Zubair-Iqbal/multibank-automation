/**
 * Mobile Navigation Tests — Part 2 (responsive)
 *
 * Validates navigation behaviour at a mobile viewport (390 × 844):
 *  - Desktop nav is hidden; hamburger button is shown instead
 *  - Opening the menu reveals a dialog with internal nav links
 *  - Closing the menu hides the dialog
 *  - Tapping a mobile nav link routes to the correct page
 *
 * Test data: test-data/navigation.json (no hard-coded values in assertions)
 */

const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('navigation');

// Pin every test in this file to a mobile viewport
test.use({ viewport: data.mobileViewport });

// ─────────────────────────────────────────────────────────────
// Suite — Mobile Navigation
// ─────────────────────────────────────────────────────────────
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
    // The menu may include external links (e.g. token.multibankgroup.com)
    // — assert that at least some links are internal /en-AE/ paths
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
    // Click via the mobile menu dialog — desktop nav is hidden at this viewport
    await navigationPage.clickMobileMenuLink(exploreHref, data.routes.explore);
    expect(navigationPage.getUrl()).toContain(data.routes.explore);
  });
});
