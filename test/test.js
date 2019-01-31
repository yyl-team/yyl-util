'use strict';
const util = require('../index.js');
const expect = require('chai').expect;
const fs = require('fs');
const extFs = require('yyl-fs');
const path = require('path');

const TEST_CTRL = {
  ENV_STRINGIFY: true,
  ENV_PARSE: true,
  REQUIRE_JS: true,
  MAKE_CSS_JS_DATE: true,
  MAKE_ARRAY: true,
  TYPE: true,
  EXTEND: true,
  COMPARE_VERSION: true,
  SHORT_ENV_STRINGIFY: true,
  SHORT_ENV_PARSE: true,
  MAKE_AWAIT: true,
  MAKE_ASYNC: true,
  WAIT_FOR: true,
  FOR_EACH: true
};

const FRAG_PATH = path.join(__dirname, '__frag');

const fn = {
  frag: {
    async build () {
      if (!fs.existsSync(FRAG_PATH)) {
        await extFs.mkdirSync(FRAG_PATH);
      } else {
        await extFs.removeFiles(FRAG_PATH);
      }
    },
    async destory () {
      await extFs.removeFiles(FRAG_PATH, true);
    }
  }
};

if (TEST_CTRL.ENV_STRINGIFY) {
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
}

if (TEST_CTRL.ENV_PARSE) {
  describe('util.envParse(argv)', () => {
    it('function test', () => {
      expect(util.envParse('--name sub')).to.deep.equal({
        name: 'sub'
      });
      expect(util.envParse('--name true')).to.deep.equal({
        name: true
      });
      expect(util.envParse('--name 123')).to.deep.equal({
        name: 123
      });

      expect(util.envParse(['--name', 'sub'])).to.deep.equal({
        name: 'sub'
      });
      expect(util.envParse(['--name', 'true'])).to.deep.equal({
        name: true
      });
      expect(util.envParse(['--name', 'false'])).to.deep.equal({
        name: false
      });
      expect(util.envParse(['--name', '123'])).to.deep.equal({
        name: 123
      });
    });
  });
}

if (TEST_CTRL.REQUIRE_JS) {
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
}

if (TEST_CTRL.MAKE_CSS_JS_DATE) {
  describe('util.makeCssJsDate()', () => {
    it('usage test', () => {
      expect(util.makeCssJsDate());
    });
  });
}

if (TEST_CTRL.MAKE_ARRAY) {
  describe('util.makeArray()', () => {
    it('useage test', () => {
      expect(util.makeArray({
        '0': 1,
        '1': 2,
        'length': 2
      })).to.deep.equal([1, 2]);
    });
  });
}

if (TEST_CTRL.TYPE) {
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
}


if (TEST_CTRL.EXTEND) {
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
}

if (TEST_CTRL.COMPARE_VERSION) {
  describe('util.compareVersion(v1, v2)', () => {
    it('normal compare', () => {
      expect(util.compareVersion('2.0.1', '2.0.0')).to.equal(1);
      expect(util.compareVersion('2.1.0', '2.0.0')).to.equal(1);
      expect(util.compareVersion('2.1.0', '2.0.1')).to.equal(1);
      expect(util.compareVersion('1.1.0', '2.0.0')).to.equal(-1);
    });
    it('^1.0.0, ~1.0.0, v1.0.0 version compare', () => {
      expect(util.compareVersion('^2.0.1', '2.0.0')).to.equal(1);
      expect(util.compareVersion('~2.1.0', '2.0.0')).to.equal(1);
      expect(util.compareVersion('v2.1.0', '2.0.1')).to.equal(1);
      expect(util.compareVersion('^1.1.0', '~2.0.0')).to.equal(-1);
    });
  });
}

if (TEST_CTRL.PATH) {
  describe('util.path.join() test', () => {
    it('web url test', () => {
      expect(util.path.join('http://www.yy.com/991')).to.equal('http://www.yy.com/991');
      expect(util.path.join('https://www.yy.com/991')).to.equal('https://www.yy.com/991');
      expect(util.path.join('//www.yy.com/991')).to.equal('//www.yy.com/991');
    });
    it('file path test', () => {
      expect(util.path.join('./../test/test.js')).to.equal('../test/test.js');
      expect(util.path.join('.\\..\\test\\test.js')).to.equal('../test/test.js');
    });
  });

  describe('util.path.relative() test', () => {
    it('file path test', () => {
      expect(util.path.relative('./../test/', './../test2/1.md')).to.equal('../test2/1.md');
      expect(util.path.relative('.\\..\\test\\', '.\\..\\test2\\1.md')).to.equal('../test2/1.md');
    });
  });

  describe('util.path.resolve() test', () => {
    it('file path test', () => {
      expect(util.path.relative('./../test/', './../test2/1.md')).to.equal('../test2/1.md');
      expect(util.path.relative('.\\..\\test\\', '.\\..\\test2\\1.md')).to.equal('../test2/1.md');
    });
  });
}

if (TEST_CTRL.MAKE_AWAIT) {
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
}

if (TEST_CTRL.MAKE_ASYNC) {
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
  });
}

if (TEST_CTRL.SHORT_ENV_STRINGIFY) {
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
}

if (TEST_CTRL.SHORT_ENV_PARSE) {
  describe('util.shortEnvParse(argv)', () => {
    it('function test', () => {
      expect(util.shortEnvParse('-name sub')).to.deep.equal({
        name: 'sub'
      });
      expect(util.shortEnvParse('-name true')).to.deep.equal({
        name: true
      });
      expect(util.shortEnvParse('-name 123')).to.deep.equal({
        name: 123
      });

      expect(util.shortEnvParse(['-name', 'sub'])).to.deep.equal({
        name: 'sub'
      });
      expect(util.shortEnvParse(['-name', 'true'])).to.deep.equal({
        name: true
      });
      expect(util.shortEnvParse(['-name', 'false'])).to.deep.equal({
        name: false
      });
      expect(util.shortEnvParse(['-name', '123'])).to.deep.equal({
        name: 123
      });
    });
  });
}

if (TEST_CTRL.WAIT_FOR) {
  describe('util.waitFor(ms)', () => {
    it ('usage test', util.makeAsync(async () => {
      const now = new Date();
      await util.waitFor(200);
      expect(new Date() - now >= 200).to.equal(true);
    }, true));
  });
}

if (TEST_CTRL.FOR_EACH) {
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
}
