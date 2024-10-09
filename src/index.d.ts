// index.d.ts
declare module 'cypress-plugin-last-failed' {
  /**
   * Collects failed tests from the most recent Cypress test run.
   *
   * After each run, a file will store failed test titles within a test-results directory.
   *
   * @param {Function} on - Cypress event registration function.
   * @param {object} config - Cypress config object.
   * @returns {void}
   */
  export function collectFailingTests(
    on: (event: string, callback: Function) => void,
    config: { env: { TEST_RESULTS_PATH?: string }; configFile: string }
  ): void;

  /**
   * Toggles the display of failed tests in the Cypress UI.
   *
   * @returns {void}
   */
  export function failedTestToggle(): void;
}
