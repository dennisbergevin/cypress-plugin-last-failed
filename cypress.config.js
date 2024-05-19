const { defineConfig } = require('cypress');
const { collectFailingTests } = require('./src/index');

module.exports = defineConfig({
  env: {
    failedTestDirectory: './cypress/fixtures',
  },
  screenshotOnRunFailure: false,
  e2e: {
    setupNodeEvents(on, config) {
      collectFailingTests(on, config);

      require('@bahmutov/cy-grep/src/plugin')(config);
      return config;
    },
  },
  component: {
    setupNodeEvents(on, config) {
      collectFailingTests(on, config);

      require('@bahmutov/cy-grep/src/plugin')(config);
      return config;
    },
  },
});
