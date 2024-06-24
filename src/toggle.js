/**
 * Find and grep all the failed test titles designated within the Cypress Test Runner UI.
 *
 * Any retried tests that failed but ultimately passed will not be included.
 *
 * See README for recommendation on handling skipped tests ordinarily seen within the Cypress Test Runner UI.
 */

const grepFailed = () => {
  // @ts-ignore
  const failedTestTitles = [];

  const failedTests = window.top?.document.querySelectorAll(
    '.test.runnable.runnable-failed'
  );

  [...failedTests].forEach((test) => {
    failedTestTitles.push(test.innerText.split('\n')[0]);
  });

  if (!failedTestTitles.length) {
    console.log('No failed tests found');
  } else {
    console.log('running only the failed tests');
    const grepTitles = failedTestTitles.join('; ');
    // @ts-ignore
    Cypress.grep(grepTitles);
  }
};

/**
 * Toggle for use within a spec file during `cypress open`
 */

export const failedTestToggle = () => {
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
      grepFailed();

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

// Wrapping logic within isInteractive check
// This targets cypress open mode where user can switch specs
if (Cypress.config('isInteractive')) {
  Cypress.on('window:unload', () => {
    // Store the current Cypress test runner url
    // This is to check against any spec change in test runner while the grep filter is activated
    // If a user does switch spec while filter is active, the filter will be reset
    const sidebarRunsLinkPage = window.top?.document.querySelector(
      '[data-cy="sidebar-link-runs-page"]'
    );
    const runFailedToggleElement =
      window.top?.document.querySelector('#runFailedToggle');

    if (
      window.top?.document.URL !=
        sidebarRunsLinkPage.getAttribute('data-url') &&
      runFailedToggleElement.checked
    ) {
      runFailedToggleElement.click();
    }

    sidebarRunsLinkPage.setAttribute('data-url', window.top?.document.URL);
  });
}
