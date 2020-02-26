const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.waitFor(ms)', () => {
  it ('usage test', util.makeAsync(async () => {
    const now = new Date();
    await util.waitFor(200);
    expect(new Date() - now >= 200).to.equal(true);
  }, true));
});