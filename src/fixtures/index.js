const { test: base } = require('@playwright/test');
const { NavigationPage } = require('../pages/NavigationPage');
const { TradingPage } = require('../pages/TradingPage');
const { HomePage } = require('../pages/HomePage');
const { AboutPage } = require('../pages/AboutPage');

const test = base.extend({
  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },

  tradingPage: async ({ page }, use) => {
    await use(new TradingPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
});

const { expect } = base;

module.exports = { test, expect };
