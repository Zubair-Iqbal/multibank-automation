/**
 * Navigation & Layout Tests — Part 2
 *
 * Validates the top navigation bar, logo, auth CTAs, and
 * that nav links route to the correct destinations.
 *
 * Test data: test-data/navigation.json (no hard-coded values in assertions)
 */

const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('navigation');

// ─────────────────────────────────────────────────────────────
// Suite 1 — Header & Nav Structure
// ─────────────────────────────────────────────────────────────
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
    const href = await navigationPage.logo.getAttribute('href');
    // Logo href can be '/' or '/en-AE' depending on locale routing
    expect(href).toMatch(/^\/(en-AE)?$/);
  });

});

// ─────────────────────────────────────────────────────────────
// Suite 2 — Navigation Routing
// ─────────────────────────────────────────────────────────────
test.describe('Navigation Routing', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.goToHome();
  });

  test('clicking "Explore" navigates to the explore page', async ({ navigationPage }) => {
    await navigationPage.exploreLink.click();
    await navigationPage.page.waitForURL(`**${data.routes.explore}`, { timeout: 15000 });
    expect(navigationPage.getUrl()).toContain(data.routes.explore);
  });

  test('clicking "Features" navigates to the features page', async ({ navigationPage }) => {
    await navigationPage.featuresLink.click();
    await navigationPage.page.waitForURL(`**${data.routes.features}`, { timeout: 15000 });
    expect(navigationPage.getUrl()).toContain(data.routes.features);
  });

  test('clicking "Company" navigates to the company page', async ({ navigationPage }) => {
    await navigationPage.companyLink.click();
    await navigationPage.page.waitForURL(`**${data.routes.company}`, { timeout: 15000 });
    expect(navigationPage.getUrl()).toContain(data.routes.company);
  });

  test('navigating back from a sub-page returns to home', async ({ navigationPage }) => {
    await navigationPage.exploreLink.click();
    await navigationPage.page.waitForURL(`**${data.routes.explore}`, { timeout: 15000 });
    await navigationPage.page.goBack();
    await navigationPage.page.waitForURL(`**/en-AE`, { timeout: 15000 });
    expect(navigationPage.getUrl()).toContain('/en-AE');
  });

  test('header remains visible after navigating to Explore page', async ({ navigationPage }) => {
    await navigationPage.exploreLink.click();
    await navigationPage.page.waitForURL(`**${data.routes.explore}`, { timeout: 15000 });
    expect(await navigationPage.isHeaderVisible()).toBe(true);
  });
});
