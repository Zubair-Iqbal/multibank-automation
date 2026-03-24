const { test: base } = require('@playwright/test');
const { NavigationPage } = require('../pages/NavigationPage');
const { TradingPage } = require('../pages/TradingPage');
const { HomePage } = require('../pages/HomePage');
const { AboutPage } = require('../pages/AboutPage');

/**
 * Extended test fixture that provides pre-instantiated page objects
 * for all test suites, ensuring consistent setup and teardown.
 */
const test = base.extend({
  navigationPage: async ({ page }, use) => {
    const navigationPage = new NavigationPage(page);
    await use(navigationPage);
  },

  tradingPage: async ({ page }, use) => {
    const tradingPage = new TradingPage(page);
    await use(tradingPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  aboutPage: async ({ page }, use) => {
    const aboutPage = new AboutPage(page);
    await use(aboutPage);
  },
});

const { expect } = base;

module.exports = { test, expect };
