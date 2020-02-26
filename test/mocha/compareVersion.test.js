const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.compareVersion(v1, v2)', () => {
  it('normal compare', () => {
    expect(util.compareVersion('2.0.1', '2.0.0')).to.equal(1);
    expect(util.compareVersion('2.1.0', '2.0.0')).to.equal(1);
    expect(util.compareVersion('2.1.0', '2.1.0')).to.equal(0);
    expect(util.compareVersion('2.1.0', '2.0.1')).to.equal(1);
    expect(util.compareVersion('1.1.0', '2.0.0')).to.equal(-1);
  });
  it('^1.0.0, ~1.0.0, v1.0.0 version compare', () => {
    expect(util.compareVersion('^2.0.1', '2.0.0')).to.equal(1);
    expect(util.compareVersion('~2.1.0', '2.0.0')).to.equal(1);
    expect(util.compareVersion('v2.1.0', '2.0.1')).to.equal(1);
    expect(util.compareVersion('^1.1.0', '~2.0.0')).to.equal(-1);

    expect(util.compareVersion('~2.1.0', '2.1.0')).to.equal(0);
    expect(util.compareVersion('^2.1.0', '2.1.0')).to.equal(0);
    expect(util.compareVersion('v2.1.0', '2.1.0')).to.equal(0);
    expect(util.compareVersion(1, 1)).to.equal(0);
  });
});