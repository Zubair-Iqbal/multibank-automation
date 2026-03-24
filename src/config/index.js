const ENVIRONMENTS = {
  production: {
    baseUrl: 'https://mb.io',
    apiBaseUrl: 'https://mb.io/api',
    timeouts: {
      navigation: 30000,
      action:     15000,
      api:        20000,
      expect:     15000,
    },
    homePath:     '/en-AE',
    localeSuffix: 'en-AE',
  },

  staging: {
    baseUrl: 'https://staging.mb.io',
    apiBaseUrl: 'https://staging.mb.io/api',
    timeouts: {
      navigation: 45000,
      action:     20000,
      api:        30000,
      expect:     20000,
    },
    homePath:     '/en-AE',
    localeSuffix: 'en-AE',
  },
};

const env = (process.env.TEST_ENV ?? 'production').toLowerCase();

if (!ENVIRONMENTS[env]) {
  throw new Error(
    `Unknown TEST_ENV "${env}". Valid values: ${Object.keys(ENVIRONMENTS).join(', ')}`
  );
}

const config = Object.freeze({
  env,
  ...ENVIRONMENTS[env],
});

module.exports = { config };
