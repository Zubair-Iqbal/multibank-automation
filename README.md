# MultiBank Automation Framework

Production-grade Playwright test automation for the [MultiBank trading platform](https://mb.io/en-AE).

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18 or higher |
| npm | 9 or higher |
| Git | any recent version |

Verify your setup:
```bash
node --version   # must be >= 18
npm --version    # must be >= 9
```

---

## Quick Start

```bash
# 1. Clone the repo
git clone git@github.com:Zubair-Iqbal/multibank-automation.git
cd multibank-automation

# 2. Install dependencies
npm install

# 3. Install Playwright browsers (Chromium, Firefox, WebKit)
npm run install:browsers

# 4. Run the full suite
npm test
```

---

## Project Structure

```
├── .github/workflows/
│   └── playwright.yml          # CI/CD — runs all 3 browsers in parallel
│
├── src/
│   ├── config/
│   │   └── index.js            # Config singleton; switch env via TEST_ENV
│   ├── fixtures/
│   │   └── index.js            # Custom Playwright fixtures (page object DI)
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.js         # Shared navigation + wait utilities
│   │   ├── NavigationPage.js   # Header, main nav, mobile menu
│   │   ├── TradingPage.js      # Spot market, category tabs, asset table
│   │   ├── HomePage.js         # Hero, download CTA, footer
│   │   └── AboutPage.js        # Company / Why MultiBank page
│   └── utils/
│       ├── helpers.js          # loadTestData(), retry() w/ exponential backoff
│       └── logger.js           # Structured logger (DEBUG/INFO/WARN/ERROR)
│
├── tests/
│   ├── navigation/
│   │   ├── navigation.spec.js       # Desktop header & routing tests
│   │   └── navigation.mobile.spec.js # Mobile viewport / hamburger menu tests
│   ├── trading/
│   │   └── trading.spec.js          # Spot market, tabs, API-backed assertions
│   └── content/
│       └── content.spec.js          # Homepage, footer, company page
│
├── test-data/                   # All assertion values live here — zero in specs
│   ├── navigation.json
│   ├── trading.json
│   └── content.json
│
├── .eslintrc.js                 # ESLint rules (no-unused-vars, eqeqeq, …)
└── playwright.config.js         # Timeouts, reporters, browser projects
```

---

## Running Tests

### Full suite (all browsers)
```bash
npm test
```

### Single browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Single suite
```bash
npm run test:navigation
npm run test:trading
npm run test:content
```

### Headed mode (watch the browser)
```bash
npx playwright test --project=chromium --headed
```

### Single spec file
```bash
npx playwright test tests/navigation/navigation.mobile.spec.js --project=chromium
```

### HTML report
```bash
npm run report
```

### Lint
```bash
npm run lint        # check
npm run lint:fix    # auto-fix
```

---

## Configuration Guide

### Switching environments

The framework ships with `production` (default) and `staging` profiles defined in `src/config/index.js`. Select via the `TEST_ENV` environment variable:

```bash
# Default — runs against https://mb.io
npm test

# Staging
TEST_ENV=staging npm test
```

Each environment defines its own `baseUrl`, `apiBaseUrl`, and `timeouts`. To add a new environment, add an entry to the `ENVIRONMENTS` object in `src/config/index.js`.

### Log verbosity

Control output with the `LOG_LEVEL` environment variable (writes to stderr, does not pollute test reporter output):

| Level | Shows |
|---|---|
| `debug` | Everything — navigation, API responses, retry attempts |
| `info` | Navigations and API intercepts (default) |
| `warn` | Retry failures only |
| `error` | Final retry exhaustion only |
| `silent` | Nothing |

```bash
LOG_LEVEL=debug npm test
LOG_LEVEL=silent npm test
```

### Retry and timeouts

Defaults (from `src/config/index.js`, production profile):

| Setting | Value |
|---|---|
| Navigation timeout | 30 000 ms |
| Action timeout | 15 000 ms |
| API wait timeout | 20 000 ms |
| Playwright retries (CI) | 2 |
| Playwright retries (local) | 1 |
| `retry()` utility attempts | 3 with exponential backoff (200 → 400 → 800 ms) |

---

## Extending the Framework

### Adding a new page

1. Create `src/pages/FeaturePage.js` extending `BasePage`:
   ```js
   const { BasePage } = require('./BasePage');

   class FeaturePage extends BasePage {
     constructor(page) {
       super(page);
       this.heading = page.locator('h1').filter({ hasText: 'Features' });
     }

     async goToFeatures() {
       await this.navigate('/en-AE/features');
       await this.heading.waitFor({ state: 'visible' });
     }

     async isHeadingVisible() {
       return this.heading.isVisible().catch(() => false);
     }
   }

   module.exports = { FeaturePage };
   ```

2. Register it as a fixture in `src/fixtures/index.js`:
   ```js
   const { FeaturePage } = require('../pages/FeaturePage');

   const test = base.extend({
     // ... existing fixtures ...
     featurePage: async ({ page }, use) => {
       await use(new FeaturePage(page));
     },
   });
   ```

3. Create `tests/features/features.spec.js`:
   ```js
   const { test, expect } = require('../../src/fixtures');
   const { loadTestData } = require('../../src/utils/helpers');

   const data = loadTestData('features');

   test.describe('Features Page', () => {
     test.beforeEach(async ({ featurePage }) => {
       await featurePage.goToFeatures();
     });

     test('page heading is visible', async ({ featurePage }) => {
       expect(await featurePage.isHeadingVisible()).toBe(true);
     });
   });
   ```

4. Add `test-data/features.json` with any assertion values.

### Adding mobile tests for a new page

Pin a viewport at the top of the spec file:
```js
const data = loadTestData('features');
test.use({ viewport: data.mobileViewport }); // { width: 390, height: 844 }
```

### Adding test data

All test data lives in `test-data/*.json`. Keep assertions out of spec files — reference values by key. Patterns (used with `new RegExp(data.somePattern)`) are stored as strings so they survive JSON serialization.

---

## Troubleshooting

### `Error: browserType.launch: Executable doesn't exist`
Browsers haven't been installed yet.
```bash
npm run install:browsers
```

### `TimeoutError: page.goto: Timeout 30000ms exceeded`
The site may be slow or your network is throttled. Try increasing the navigation timeout in `src/config/index.js` under your environment's `timeouts.navigation`, or re-run — the Playwright retry mechanism will catch transient failures.

### `Error: Unknown TEST_ENV "…"`
You passed an unsupported value to `TEST_ENV`. Valid values are `production` and `staging`. Check `src/config/index.js` for the full list.

### Tests pass locally but fail on CI
- Confirm browser binaries are cached in CI (the workflow runs `npm run install:browsers`)
- Check the HTML report artifact uploaded by the CI job — traces and screenshots are attached for every failure
- CI uses 2 workers; if a test depends on global state it may fail under parallelism

### `npm run lint` reports errors
Run `npm run lint:fix` to auto-fix formatting issues. For logic errors (e.g. `no-unused-vars`) delete the unused code — do not suppress the rule.

---

## Design Decisions

| Decision | Rationale |
|---|---|
| Page Object Model | Selectors live in one place; tests read as plain English |
| External test data (JSON) | Changing a URL or label requires editing JSON, not hunting through specs |
| No `waitForTimeout()` | Hard sleeps mask real problems; deterministic waits (URL, response, visibility) are used instead |
| Exponential backoff retry | Wraps flaky operations (virtual table render) without hiding failures — errors still surface after 3 attempts |
| Structured logger to stderr | Test reporter stdout stays clean; verbosity controlled per run without code changes |
| Config singleton | One place to change timeouts or base URL; multi-environment support with zero code duplication |
| ESLint | `no-unused-vars` catches dead code before it ships; `no-console` enforces logger usage |

---

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions across all three browsers in parallel. Artifacts (HTML report, JUnit XML, traces) are retained for 14 days.

See `.github/workflows/playwright.yml` for the full pipeline definition.
