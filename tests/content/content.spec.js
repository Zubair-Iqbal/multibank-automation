/**
 * Content Validation Tests
 * Validates banners, download links, and Why MultiBank page.
 * Part 4 of the MultiBank automation framework.
 */

const { test, expect } = require('../../src/fixtures');
const { loadTestData } = require('../../src/utils/helpers');

const data = loadTestData('content');

test.describe('Content Validation', () => {
  test.describe('Download Section', () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.goToHome();
    });

    test('App Store link is present and points to Apple', async ({ homePage }) => {
      const href = await homePage.getAppStoreHref();
      expect(href).toBeTruthy();
      expect(href).toContain(data.appStoreUrlPattern);
    });

    test('Google Play link is present and points to Google', async ({ homePage }) => {
      const href = await homePage.getGooglePlayHref();
      expect(href).toBeTruthy();
      expect(href).toContain(data.googlePlayUrlPattern);
    });
  });
});
