describe('Should run expected tests', () => {
  it('should run', () => {
    if (Cypress.env('shouldPass')) {
      expect(true).to.eq(true);
    } else {
      expect(true).to.eq(false);
    }
  });

  it('should not run', () => {
    expect(true).to.eq(true);
  });

  it('needs to run', () => {
    if (Cypress.env('shouldPass')) {
      expect(1).to.eq(1);
    } else {
      expect(1).to.eq(2);
    }
  });

  it('will be included in failed tests', () => {
    if (Cypress.env('shouldPass')) {
      expect(10).to.eq(10);
    } else {
      expect(10).to.eq(2);
    }
  });

  it('retry', { requiredTags: '@skip', retries: 1 }, () => {
    if (Cypress.currentRetry === 0) {
      expect(10).to.eq(2);
    } else {
      expect(10).to.eq(10);
    }
  });

  it('skipped', { requiredTags: '@skip' }, () => {
    expect(10).to.eq(10);
  });
});
