const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.makeArray()', () => {
  it('useage test', () => {
    expect(util.makeArray({
      '0': 1,
      '1': 2,
      'length': 2
    })).to.deep.equal([1, 2]);
  });
});