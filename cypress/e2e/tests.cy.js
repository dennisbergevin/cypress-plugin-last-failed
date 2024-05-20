describe('Should run expected tests', () => {
  it('should run', () => {
    expect(true).to.eq(false);
  });
  it('should not run', () => {
    expect(true).to.eq(true);
  });
  it('needs to run', () => {
    expect(1).to.eq(2);
  });
  it('will be included in failed tests', () => {
    expect(10).to.eq(2);
  });
});
