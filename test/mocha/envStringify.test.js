const util = require('../../lib/yyl-util');
const { expect } = require('chai');

describe('util.envStringify(obj)', () => {
  it('string test', () => {
    expect(util.envStringify({
      name: 'sub'
    })).to.equal('--name sub');
  });

  it('boolean test', () => {
    expect(util.envStringify({
      name: true
    })).to.equal('--name');

    expect(util.envStringify({
      name: 'true'
    })).to.equal('--name');

    expect(util.envStringify({
      name: false
    })).to.equal('--name false');

    expect(util.envStringify({
      name: 'false'
    })).to.equal('--name false');
  });


  it('number test', () => {
    expect(util.envStringify({
      name: 123
    })).to.equal('--name 123');
  });

  it('muti test', () => {
    expect(util.envStringify({
      name: 'hello',
      num: 1,
      real: true
    })).to.equal('--name hello --num 1 --real');
  });
});