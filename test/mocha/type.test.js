const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.type()', () => {
  it('type array test', () => {
    expect(util.type([])).to.equal('array');
  });

  it('type object test', () => {
    expect(util.type({})).to.equal('object');
  });

  it('type function test', () => {
    expect(util.type(() => {})).to.equal('function');
  });

  it('type number test', () => {
    expect(util.type(1)).to.equal('number');
  });

  it('type undefined test', () => {
    expect(util.type(undefined)).to.equal('undefined');
  });

  it('type null test', () => {
    expect(util.type(null)).to.equal('null');
  });
});