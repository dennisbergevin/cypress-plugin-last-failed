#!/usr/bin/env node

const cypress = require('cypress');
const fs = require('fs');
const path = require('path');
const appDir = process.env.INIT_CWD ? process.env.INIT_CWD : path.resolve('.');

async function runLastFailed() {
  const noFailedTestsMessage = `No previous failed tests detected
Ensure you are in the directory of your cypress config
Try running tests again with cypress run`;

  const failedTestFilePath = `${appDir}/test-results/last-run.txt`;

  if (fs.existsSync(failedTestFilePath)) {
    // Retrieve the failedTests from the file
    const failedTests = await fs.promises.readFile(failedTestFilePath, 'utf8');

    if (failedTests.length > 0) {
      // Allow for additional cli arguments to be passed to the run command
      const runOptions = await cypress.cli.parseRunArguments(
        process.argv.slice(2)
      );

      // Set cypress environment variables needed for running last failed tests
      process.env.CYPRESS_grep = `${failedTests}`;
      process.env.CYPRESS_grepFilterSpecs = true;
      process.env.CYPRESS_grepOmitFiltered = true;

      await cypress.run(runOptions);
    } else {
      console.log(noFailedTestsMessage);
    }
  } else {
    console.log(noFailedTestsMessage);
  }
}

runLastFailed();
