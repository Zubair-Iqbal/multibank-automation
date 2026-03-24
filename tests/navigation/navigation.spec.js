/**
 * Navigation & Layout Tests
 * Validates top nav menu presence, items, and link destinations.
 * Part 2 of the MultiBank automation framework.
 */

const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('navigation');

test.describe('Navigation & Layout', () => {
  test.beforeEach(async ({ navigationPage }) => {
    await navigationPage.goToHome();
  });

  test('navigation bar is visible on homepage', async ({ navigationPage }) => {
    expect(await navigationPage.isNavVisible()).toBe(true);
  });

  test('navigation has minimum expected number of links', async ({ navigationPage }) => {
    const count = await navigationPage.getNavLinkCount();
    expect(count).toBeGreaterThanOrEqual(data.minNavLinkCount);
  });

  test('navigation contains expected items', async ({ navigationPage }) => {
    const texts = await navigationPage.getNavLinkTexts();
    const allTexts = texts.join(' ');
    for (const item of data.expectedNavItemsPartial) {
      expect(allTexts).toContain(item);
    }
  });

  test('all nav links have valid href attributes', async ({ navigationPage }) => {
    const hrefs = await navigationPage.getNavLinkHrefs();
    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href).toBeTruthy();
      expect(href).not.toBe('#');
    }
  });

  test('logo is visible in the header', async ({ navigationPage }) => {
    expect(await navigationPage.isLogoVisible()).toBe(true);
  });
});
