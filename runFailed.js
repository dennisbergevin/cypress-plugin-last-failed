#!/usr/bin/env node

const cypress = require("cypress");
const fs = require("fs");
const path = require("path");
const appDir = process.env.INIT_CWD ? process.env.INIT_CWD : path.resolve(".");

async function runLastFailed() {
  const noFailedTestsMessage = `No previous failed tests detected
Ensure you are in the directory of your cypress config
Try running tests again with cypress run`;

  const failedTestFilePath = process.env.LAST_FAILED_RESULTS_PATH
    ? path.join(
        appDir,
        process.env.LAST_FAILED_RESULTS_PATH,
        "test-results",
        "last-run.json"
      )
    : path.join(appDir, "test-results", "last-run.json");

  if (fs.existsSync(failedTestFilePath)) {
    // Retrieve the failedTests from the file
    const failedTests = await fs.promises.readFile(failedTestFilePath, "utf8");

    // Retrieve the parent suite and tests in the results from test-results/last-run
    const parentAndTest = JSON.parse(failedTests).map(({ parent, test }) => ({
      parent,
      test,
    }));
    // Combine parent suite and test together
    const resultSet = new Set(
      Object.values(parentAndTest).flatMap(
        (parent) => parent.parent + "," + parent.test + ";"
      )
    );
    // Format string for use in grep functionality
    const stringedTests = Array.from(resultSet)
      .toString()
      .replaceAll(",", " ")
      .slice(0, -1);

    if (stringedTests.length > 0) {
      // Allow for additional cli arguments to be passed to the run command
      const runOptions = await cypress.cli.parseRunArguments(
        process.argv.slice(2)
      );

      // Set cypress environment variables needed for running last failed tests
      process.env.CYPRESS_grep = `${stringedTests}`;
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
