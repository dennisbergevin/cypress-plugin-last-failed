const fs = require('fs');
const path = require('path');
const failedTestToggle = require('./toggle');

/**
 * Collects failed tests from the most recent Cypress test run
 *
 * After each run, a file will store failed test titles within a test-results directory
 *
 * The test-results directory will be stored in the cypress.config directory
 *
 * Subsequent test runs containing failed tests will overwrite this file
 * @param {*} on
 * @param {*} config
 * @returns
 */
const collectFailingTests = (on, config) => {
  on('after:run', async (results) => {
    let failedTests = [];

    for (const run of results.runs) {
      if (run.tests && run.spec) {
        const tests = run.tests
          .filter((test) => test.state === 'failed')
          .map((test) => test.title);

        const spec = run.spec.relative;

        failedTests = failedTests.concat(generateReports(tests, spec, config));
      }
    }

    // Use process.env.LAST_FAILED_RESULTS_PATH or fallback to the default path
    const failedTestFilePath = process.env.LAST_FAILED_RESULTS_PATH
      ? path.join(
          process.env.INIT_CWD,
          process.env.LAST_FAILED_RESULTS_PATH,
          'test-results'
        )
      : `${path.dirname(config.configFile)}/test-results/`;

    // Create the directory and last-run file where failed tests will be written to
    await fs.promises.mkdir(failedTestFilePath, { recursive: true });
    const lastRunReportFile = path.join(failedTestFilePath, 'last-run.json');
    await fs.promises.writeFile(lastRunReportFile, JSON.stringify(failedTests));
  });

  return collectFailingTests;
};

const generateReports = (tests, spec, config) => {
  let reports = [];
  for (const test of tests) {
    const testCopy = [...test]; // Create a copy of the array to avoid mutation
    let testTitle = testCopy.pop(); // Extract the test title
    if (testTitle) {
      // If --env burn=X is set from cy-grep, remove the ": burning X of X"
      testTitle = config.env.burn
        ? testTitle.replace(/: burning .* of .*/, '')
        : testTitle;
      const report = {
        spec: spec,
        parent: testCopy, // Parent titles
        test: testTitle, // The actual test title
      };
      reports.push(report);
    }
  }
  // If --env burn=X is set from cy-grep, remove the duplicate test objects
  if (config.env.burn) {
    const seen = new Set();
    const filteredReports = reports.filter((el) => {
      const duplicate = seen.has(el.test);
      seen.add(el.test);
      return !duplicate;
    });
    return filteredReports;
  } else {
    return reports;
  }
};

module.exports = { collectFailingTests, failedTestToggle };
