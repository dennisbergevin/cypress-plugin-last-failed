const { defineConfig } = require('cypress');
const { collectFailingTests } = require('../../src/index');

module.exports = defineConfig({
  env: {
    grepOmitFiltered: true,
    grepFilterSpecs: true,
  },
  screenshotOnRunFailure: false,
  e2e: {
    setupNodeEvents(on, config) {
      require('@bahmutov/cy-grep/src/plugin')(config);
      collectFailingTests(on, config);

      return config;
    },
  },
  component: {
    setupNodeEvents(on, config) {
      require('@bahmutov/cy-grep/src/plugin')(config);
      collectFailingTests(on, config);

      return config;
    },
  },
});
