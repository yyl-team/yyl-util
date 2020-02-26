const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.extend()', () => {
  it('sample test', () => {
    const obj01 = {
      a: 1
    };
    const obj02 = {
      a: 2,
      b: 2
    };
    const r = util.extend(obj01, obj02);

    expect(obj01).to.deep.equal({
      a: 2,
      b: 2
    });
    expect(obj02).to.deep.equal({
      a: 2,
      b: 2
    });
    expect(r).to.deep.equal({
      a: 2,
      b: 2
    });
  });

  it('deep test', () => {
    const obj01 = {
      a: 1,
      b: {
        b1: 1,
        b2: 2
      }
    };
    const obj02 = {
      a: 2,
      b: {
        b1: 2,
        b2: 3,
        b3: 4
      }
    };
    const r = util.extend(true, obj01, obj02);

    expect(obj01).to.deep.equal({
      a: 2,
      b: {
        b1: 2,
        b2: 3,
        b3: 4
      }
    });
    expect(obj02).to.deep.equal({
      a: 2,
      b: {
        b1: 2,
        b2: 3,
        b3: 4
      }
    });
    expect(r).to.deep.equal({
      a: 2,
      b: {
        b1: 2,
        b2: 3,
        b3: 4
      }
    });
  });

  it('extend test', () => {
    const obj01 = {
      a: 1,
      b: {
        b1: 1,
        b2: 2
      }
    };
    const obj02 = {
      a: 2,
      b: {
        b1: 2,
        b2: 3,
        b3: 4
      }
    };
    const r = util.extend({}, obj01, obj02);

    expect(obj01).to.deep.equal({
      a: 1,
      b: {
        b1: 1,
        b2: 2
      }
    });
    expect(obj02).to.deep.equal({
      a: 2,
      b: {
        b1: 2,
        b2: 3,
        b3: 4
      }
    });
    expect(r).to.deep.equal({
      a: 2,
      b: {
        b1: 2,
        b2: 3,
        b3: 4
      }
    });
  });
});