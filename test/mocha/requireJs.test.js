const util = require('../../lib/yyl-util');
const { expect } = require('chai');
const fs = require('fs');

const { fn, FRAG_PATH } = require('../fn/fn');

describe('util.requireJs(iPath)', () => {
  it('useage test', () => {
    expect(util.requireJs('../lib/yyl-util.js')).not.equal(undefined);
  });
  it('cache test', util.makeAsync(async () => {
    await fn.frag.build();

    const FRAG_JS_PATH = util.path.join(FRAG_PATH, '01.js');
    const param = {
      i: 1
    };
    fs.writeFileSync(FRAG_JS_PATH, `module.exports=${JSON.stringify(param)}`);

    expect(util.requireJs(FRAG_JS_PATH)).to.deep.equal(param);

    param.i = 2;
    fs.writeFileSync(FRAG_JS_PATH, `module.exports=${JSON.stringify(param)}`);
    expect(util.requireJs(FRAG_JS_PATH)).to.deep.equal(param);

    await fn.frag.destory();
  }, true));
});