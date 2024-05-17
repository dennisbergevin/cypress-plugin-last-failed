#!/usr/bin/env node

const cypress = require('cypress');
const fs = require('fs');
const cypressConfig = require('./cypress.config');
const { dirname } = require('path');

async function runLastFailed() {
  const appDir = dirname(require.main.filename);

  // Use the cypress environment variable failedTestDirectory for where to store failed tests
  // If not set then use the root project folder
  const failedTestFilePath =
    cypressConfig.env?.failedTestDirectory === undefined
      ? `${appDir}/test-results/last-run.txt`
      : `${cypressConfig.env.failedTestDirectory}/test-results/last-run.txt`;

  console.log(failedTestFilePath);
  if (fs.existsSync(failedTestFilePath)) {
    // Retrieve the failedTests from the file
    const failedTests = await fs.promises.readFile(failedTestFilePath, 'utf8');

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
    console.log('No previous failed tests detected');
  }
}

runLastFailed();
