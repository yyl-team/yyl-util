const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.shortEnvStringify(obj)', () => {
  it('string test', () => {
    expect(util.shortEnvStringify({
      name: 'sub'
    })).to.equal('-name sub');
  });

  it('boolean test', () => {
    expect(util.shortEnvStringify({
      name: true
    })).to.equal('-name');

    expect(util.shortEnvStringify({
      name: 'true'
    })).to.equal('-name');

    expect(util.shortEnvStringify({
      name: false
    })).to.equal('-name false');

    expect(util.shortEnvStringify({
      name: 'false'
    })).to.equal('-name false');
  });


  it('number test', () => {
    expect(util.shortEnvStringify({
      name: 123
    })).to.equal('-name 123');
  });

  it('muti test', () => {
    expect(util.shortEnvStringify({
      name: 'hello',
      num: 1,
      real: true
    })).to.equal('-name hello -num 1 -real');
  });
});