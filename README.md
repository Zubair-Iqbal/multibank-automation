# MultiBank Automation Framework

Production-grade Playwright test automation for the [MultiBank trading platform](https://trade.multibank.io).

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright Test](https://playwright.dev) | Browser automation + test runner |
| JavaScript (Node.js) | Language |
| GitHub Actions | CI/CD pipeline |

## Project Structure

```
├── .github/workflows/       # CI/CD pipeline
├── src/
│   ├── pages/               # Page Object Model classes
│   │   ├── BasePage.js      # Shared utilities
│   │   ├── NavigationPage.js
│   │   ├── TradingPage.js
│   │   ├── HomePage.js
│   │   └── AboutPage.js
│   ├── fixtures/            # Custom Playwright fixtures
│   │   └── index.js
│   └── utils/               # Helper functions
│       └── helpers.js
├── tests/
│   ├── navigation/          # Navigation & layout tests
│   ├── trading/             # Trading functionality tests
│   └── content/             # Content validation tests
├── test-data/               # External test data (JSON)
│   ├── navigation.json
│   ├── trading.json
│   └── content.json
└── playwright.config.js     # Playwright configuration
```

## Getting Started

```bash
# Install dependencies
npm install

# Install browsers
npm run install:browsers

# Run all tests (all browsers)
npm test

# Run on a specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run a specific suite
npm run test:navigation
npm run test:trading
npm run test:content

# View HTML report
npm run report
```

## Design Principles

- **Page Object Model** — All selectors and interactions live in `src/pages/`, never in test files
- **External test data** — All assertions reference `test-data/*.json`, zero hard-coded values in tests
- **Smart waits** — No `page.waitForTimeout()` for flow control; uses `waitForSelector` and `waitForLoadState`
- **Retry strategy** — CI runs with 2 retries; local runs with 1 retry
- **Failure diagnostics** — Screenshots, videos, and traces captured on failure

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions, in parallel across all three browsers. Artifacts (reports + traces) are retained for 14 days.
