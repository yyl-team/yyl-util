const util = require('../../lib/yyl-util');
const { expect } = require('chai');

describe('util.envParse(argv)', () => {
  it('function test', () => {
    expect(util.envParse('--name sub')).to.deep.equal({
      name: 'sub'
    });
    expect(util.envParse('--name true')).to.deep.equal({
      name: true
    });
    expect(util.envParse('--name 123')).to.deep.equal({
      name: 123
    });

    expect(util.envParse(['--name', 'sub'])).to.deep.equal({
      name: 'sub'
    });
    expect(util.envParse(['--name', 'true'])).to.deep.equal({
      name: true
    });
    expect(util.envParse(['--name', 'false'])).to.deep.equal({
      name: false
    });
    expect(util.envParse(['--name', '123'])).to.deep.equal({
      name: 123
    });
  });
});