const fs = require('fs');
const path = require('path');
const failedTestToggle = require('./toggle');
/**
 * Collects failed tests from the most recent Cypress test run
 *
 * After each run, a file will store failed test titles within a test-results directory
 *
 * The test-results directory will be stored in cypress.config directory
 *
 * Subsequent test runs containing failed tests will overwrite this file
 * @param {*} on
 * @param {*} config
 * @returns
 */

const collectFailingTests = (on, config) => {
  on('after:run', async (results) => {
    let failedTests = [];
    // Grab every failed test's title
    for (i in results.runs) {
      const tests = results.runs[i].tests
        .filter((test) => test.state === 'failed')
        .map((test) => test.title);

      const spec = results.runs[i].spec.relative;

      for (i in tests) {
        let report = {
          spec: spec,
          parent: tests[i][0],
          test: tests[i][1],
        };
        // Only store non empty test titles
        if (tests != '') {
          failedTests.push(report);
        }
      }
    }

    // Use the cypress.config directory for path for storing test-results
    const failedTestFileDirectory = `${path.dirname(
      config.configFile
    )}/test-results/`;

    // Create the directory and last-run file where failed tests will be written to
    await fs.promises.mkdir(`${failedTestFileDirectory}`, {
      recursive: true,
    });
    const lastRunReportFile = path.join(
      `${failedTestFileDirectory}`,
      'last-run.json'
    );
    await fs.promises.writeFile(lastRunReportFile, JSON.stringify(failedTests));
  });

  return collectFailingTests;
};

module.exports = { collectFailingTests, failedTestToggle };
