const { defineConfig } = require('cypress');
const { collectFailingTests } = require('../src');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      collectFailingTests(on, config);

      require('@bahmutov/cy-grep/src/plugin')(config);

      // implement node event listeners here
      return config;
    },
  },
});
