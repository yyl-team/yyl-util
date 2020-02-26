const util = require('../../lib/yyl-util');
const expect = require('chai').expect;
const { fn } = require('../fn/fn');

describe('util.makeAsync(fn)', () => {
  it('util.makeAsync(fn)', function (done) {
    this.timeout(0);
    new Promise (util.makeAsync(async () => {
      await util.waitFor(200);
      return 2;
    })).then((val) => {
      expect(val).to.equal(2);
      done();
    });
  });
  it ('util.makeAsync(fn, true)', util.makeAsync(async () => {
    await fn.frag.build();
    await fn.frag.destory();
  }, true));

  it ('util.makeAsync(fn, true)', util.makeAsync(async () => {
    (util.makeAsync(async () => {
      await util.waitFor(200);
    }))();
  }, true));
});