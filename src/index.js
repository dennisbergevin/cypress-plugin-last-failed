const fs = require('fs');
const path = require('path');

/**
 * Collects failed tests from the most recent Cypress test run
 *
 * After each run, a file will store failed test titles within a test-results directory on the path for fileServerFolder
 *
 * The fileServerFolder path defaults to the root project folder if unset in cypress config
 *
 * Subsequent test runs containing failed tests will overwrite this file
 * @param {*} on
 * @param {*} config
 * @returns
 */

const collectFailingTests = (on, config) => {
  // Check for environment variable `collectFailingTests` to be true
  on('after:run', async (results) => {
    let failedTests = [];
    // Grab every failed test's title
    for (i in results.runs) {
      const tests = results.runs[i].tests
        .filter((test) => test.state === 'failed')
        .map((test) => test.title[test.title.length - 1]);

      // Only store non empty test titles
      if (tests != '') {
        failedTests.push(tests);
      }
    }

    const stringedTests = failedTests.toString();
    // Prepare a string that can be read from cy-grep
    const greppedTestFormat = stringedTests.replaceAll(',', '; ');

    // Use the cypress.config environment variable for failedTestDirectory
    // If not set then use the root project folder
    const failedTestFileDirectory =
      config.env.failedTestDirectory === undefined
        ? `${path.dirname(config.configFile)}/test-results/`
        : `${config.env.failedTestDirectory}/test-results/`;

    await fs.promises.mkdir(`${failedTestFileDirectory}`, {
      recursive: true,
    });
    const lastRunReportFile = path.join(
      `${failedTestFileDirectory}`,
      'last-run.txt'
    );
    await fs.promises.writeFile(lastRunReportFile, greppedTestFormat);
  });

  return collectFailingTests;
};

/**
 * Toggle for use within a spec file during `cypress open`
 */

const failedTestToggle = () => {
  const hasStyles = top?.document.querySelector('#runFailedStyle');
  const hasToggleButton = top?.document.querySelector('#runFailedToggle');
  const defaultStyles = `
      .reporter header {
        overflow: visible;
        z-index: 2;
      }
      #runFailedControls {
        position: relative;
        display: inline-block;
      }
      #runFailedToggle {
        display: none;
      }
      #runFailedControls label {
        background-color: transparent;
        padding-top: 5px;
      }
      #runFailedControls #runFailedTooltip {
        visibility: hidden;
        width: 134px;
        background-color: #f3f4fa;
        color: #1b1e2e;
        text-align: center;
        padding: 5px;
        border-radius: 3px;
        position: absolute;
        z-index: 1;
        top: 27px;
        left: 0px;
        height: 28px;
      }
      #runFailedControls:hover #runFailedTooltip {
        visibility: visible;
      }
      #runFailedButton #runFailedLabel {
        cursor: pointer;
      }
      #runFailedTooltip::after {
        content: " ";
        position: absolute;
        bottom: 100%;  /* At the top of the tooltip */
        right: 85%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #f3f4fa transparent;
      }
      .reporter:has(#runFailed:checked) .command.command-name-request:has(.command-is-event) {
        display:none
      }
      `;
  const turnOffRunFailedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f59aa9" class="bi bi-filter-circle" viewBox="0 0 16 16">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
    <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
  </svg>`;

  const turnOnRunFailedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f59aa9" class="bi bi-filter-circle-fill" viewBox="0 0 16 16">
    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1M5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
  </svg>`;

  const turnOffRunFailedDescription = 'Filter failed tests';
  const turnOnRunFailedDescription = 'Unfilter failed tests';

  // append styles
  if (!hasStyles) {
    const reporterEl = top?.document.querySelector('#unified-reporter');
    const reporterStyleEl = document.createElement('style');
    reporterStyleEl.setAttribute('id', 'runFailedStyle');
    reporterStyleEl.innerHTML = defaultStyles;
    reporterEl?.appendChild(reporterStyleEl);
  }

  if (!hasToggleButton) {
    const header = top?.document.querySelector('#unified-reporter header');
    const headerToggleDiv = document.createElement('div');
    const headerToggleSpan = document.createElement('span');
    const headerToggleTooltip = document.createElement('span');
    const headerToggleButton = document.createElement('button');
    const headerToggleInput = document.createElement('input');
    const headerToggleLabel = document.createElement('label');

    headerToggleInput.setAttribute('type', 'checkbox');

    headerToggleInput.setAttribute('id', 'runFailedToggle');
    headerToggleLabel.setAttribute('for', 'runFailedToggle');
    headerToggleLabel.setAttribute('id', 'runFailedLabel');
    headerToggleLabel.innerHTML = turnOffRunFailedIcon;

    headerToggleDiv.setAttribute('class', 'controls');
    headerToggleDiv.setAttribute('id', 'runFailedControls');
    headerToggleTooltip.setAttribute('id', 'runFailedTooltip');
    headerToggleTooltip.innerText = turnOffRunFailedDescription;
    headerToggleButton.setAttribute('aria-label', turnOffRunFailedDescription);
    headerToggleButton.setAttribute('id', 'runFailedButton');

    header?.appendChild(headerToggleDiv);
    headerToggleDiv?.appendChild(headerToggleSpan);
    headerToggleDiv?.appendChild(headerToggleTooltip);
    headerToggleSpan?.appendChild(headerToggleButton);
    headerToggleButton?.appendChild(headerToggleInput);
    headerToggleButton?.appendChild(headerToggleLabel);
  }

  const runFailedElement = top.document.querySelector('#runFailedToggle');
  const runFailedLabelElement = top.document.querySelector(
    '[for=runFailedToggle]'
  );
  const runFailedTooltipElement =
    top.document.querySelector('#runFailedTooltip');

  runFailedElement?.addEventListener('change', (e) => {
    const stopBtn = window.top.document.querySelector('.reporter .stop');

    if (e.target.checked) {
      if (stopBtn) {
        stopBtn.click();
      }
      // when checked, grep only failed tests in spec
      Cypress.grepFailed();
      runFailedLabelElement.innerHTML = turnOnRunFailedIcon;
      runFailedTooltipElement.innerHTML = turnOnRunFailedDescription;
    } else {
      if (stopBtn) {
        stopBtn.click();
      }
      // when unchecked, ungrep and show all tests in spec
      Cypress.grep();
      runFailedLabelElement.innerHTML = turnOffRunFailedIcon;
      runFailedTooltipElement.innerHTML = turnOffRunFailedDescription;
    }
  });
};

module.exports = { collectFailingTests, failedTestToggle };
