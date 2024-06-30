#!/usr/bin/env node

const cypress = require('cypress');
const fs = require('fs');
const path = require('path');
const appDir = process.env.INIT_CWD ? process.env.INIT_CWD : path.resolve('.');

async function runLastFailed() {
  const noFailedTestsMessage = `No previous failed tests detected
Ensure you are in the directory of your cypress config
Try running tests again with cypress run`;

  const failedTestFilePath = `${appDir}/test-results/last-run.json`;

  if (fs.existsSync(failedTestFilePath)) {
    // Retrieve the failedTests from the file
    const failedTests = await fs.promises.readFile(failedTestFilePath, 'utf8');
    const tests = JSON.parse(failedTests).map((el) => el.test);
    const allSpecs = JSON.parse(failedTests).map((el) => el.spec);
    const specs = [...new Set(allSpecs)];

    const stringedSpecs = specs.toString();
    const stringedTests = tests.toString();
    // Prepare a string that can be read from cy-grep
    const greppedTestFormat = stringedTests.replaceAll(',', '; ');

    if (greppedTestFormat.length > 0) {
      // Allow for additional cli arguments to be passed to the run command
      const runOptions = await cypress.cli.parseRunArguments(
        process.argv.slice(2)
      );

      // Set cypress environment variables needed for running last failed tests
      process.env.CYPRESS_grep = `${greppedTestFormat}`;
      process.env.CYPRESS_grepSpec = `${stringedSpecs}`;
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
