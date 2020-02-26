const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.matchVersion(v1, v2)', () => {
  it('usage check', () => {
    expect(util.matchVersion('^2.0.1', '2.0.0')).to.equal(false);
    expect(util.matchVersion('^2.0.1', '2.1.0')).to.equal(true);
    expect(util.matchVersion('^2.0.1', '3.0.0')).to.equal(false);

    expect(util.matchVersion('~2.0.1', '2.0.0')).to.equal(false);
    expect(util.matchVersion('~2.0.1', '2.0.1')).to.equal(true);
    expect(util.matchVersion('~2.0.1', '3.0.0')).to.equal(false);

    expect(util.matchVersion('2.0.1', '2.0.1')).to.equal(true);
    expect(util.matchVersion('2.0.1', '2.0.2')).to.equal(false);

    expect(util.matchVersion('v2.1.0', 'v2.1.0')).to.equal(true);
    expect(util.matchVersion('v2.1.0', 'v2.1.0')).to.equal(true);
    expect(util.matchVersion('1.1.1', 'github:tj/react-click-outside')).to.equal(false);
  });
});