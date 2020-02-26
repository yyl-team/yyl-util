const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.shortEnvParse(argv)', () => {
  it('function test', () => {
    expect(util.shortEnvParse('-name sub')).to.deep.equal({
      name: 'sub'
    });
    expect(util.shortEnvParse('-name true')).to.deep.equal({
      name: true
    });
    expect(util.shortEnvParse('-name 123')).to.deep.equal({
      name: 123
    });

    expect(util.shortEnvParse(['-name', 'sub'])).to.deep.equal({
      name: 'sub'
    });
    expect(util.shortEnvParse(['-name', 'true'])).to.deep.equal({
      name: true
    });
    expect(util.shortEnvParse(['-name', 'false'])).to.deep.equal({
      name: false
    });
    expect(util.shortEnvParse(['-name', '123'])).to.deep.equal({
      name: 123
    });
  });
});