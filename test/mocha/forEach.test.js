const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.forEach(arr, fn)', () => {
  it ('usage test', util.makeAsync(async () => {
    let count = 0;
    await util.forEach([1, 2, 3], async (num) => {
      await util.waitFor(10);
      count = count + num;
    });

    expect(count).to.equal(6);
  }, true));

  it ('return true test', util.makeAsync(async () => {
    let count = 0;
    await util.forEach([1, 2, 3], async (num, index) => {
      await util.waitFor(10);
      count = count + num;
      if (index === 1) {
        return true;
      }
    });

    expect(count).to.equal(3);
  }, true));
});