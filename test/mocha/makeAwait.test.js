const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.makeAwait(Pms)', () => {
  it('usage test', function (done) {
    this.timeout(0);
    const r = [];
    util.makeAwait((next) => {
      setTimeout(() => {
        r.push(2);
        next();
      }, 10);
    }).then(() => {
      expect(r).to.deep.equal([1, 2]);
      done();
    });
    r.push(1);
  });
});