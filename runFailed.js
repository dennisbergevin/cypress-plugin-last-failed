#!/usr/bin/env node

const cypress = require('cypress');
const fs = require('fs');

async function runLastFailed() {
  const lastRunReportFile = './cypress/fixtures/last-failed/last-run.txt';

  if (fs.existsSync(lastRunReportFile)) {
    const failedTests = await fs.promises.readFile(lastRunReportFile, 'utf8');

    const runOptions = await cypress.cli.parseRunArguments(
      process.argv.slice(2)
    );

    process.env.CYPRESS_grep = `${failedTests}`;
    process.env.CYPRESS_grepFilterSpecs = true;
    process.env.CYPRESS_grepOmitFiltered = true;

    await cypress.run(runOptions);
  } else {
    console.log('No previous failed tests detected');
  }
}

runLastFailed();
