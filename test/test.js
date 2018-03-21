'use strict';
const util = require('../index.js');
const expect = require('chai').expect;
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const net = require('net');
const FRAG_PATH = path.join(__dirname, 'frag');
const FRAG_PATH2 = path.join(__dirname, 'frag2');

const
  fn = {
    frag: {
      build: function() {
        if (!fs.existsSync(FRAG_PATH)) {
          util.mkdirSync(FRAG_PATH);
        }
        util.removeFiles(FRAG_PATH);

        if (!fs.existsSync(FRAG_PATH2)) {
          util.mkdirSync(FRAG_PATH2);
        }
        util.removeFiles(FRAG_PATH2);
      },
      destory: function() {
        if (fs.existsSync(FRAG_PATH)) {
          util.removeFiles(FRAG_PATH, true);
        }

        if (fs.existsSync(FRAG_PATH2)) {
          util.removeFiles(FRAG_PATH2, true);
        }
      }
    }
  };

const TEST_CTRL = {
  READDIR_SYNC: true,
  ENV_STRINGIFY: true,
  ENV_PARSE: true,
  // OPEN_BROWSER: true,
  BUILD_TREE: true,
  FIND_PATH_SYNC: true,
  REQUIRE_JS: true,
  MKDIR_SYNC: true,
  MAKE_CSS_JS_DATE: true,
  // OPEN_PATH: true,
  JOIN_FORMAT: true,
  RUN_CMD: true,
  RUN_SPAWN: true,
  RUN_NODE_MODULE: true,
  REMOVE_FILES: true,
  PROMISE: true,
  READ_FILES_SYNC: true,
  COPY_FILES: true,
  TIMER: true,
  HELP: true,
  MSG: true,
  MAKE_ARRAY: true,
  TYPE: true,
  EXTEND: true,
  GET: true,
  POP: true,
  COMPARE_VERSION: true,
  TASK_QUEUE: true,
  DEBOUNCE: true,
  MD_2_JSON: true,
  CHECK_PORT_USEAGE: true,
  GET_TIME: true,
  GET_STR_SIZE: true,
  SUBSTR: true,
  INFO_BAR: true
};
if (TEST_CTRL.READDIR_SYNC) {
  describe('util.readdirSync(iPath, filter)', () => {
    it('usage test', () => {
      expect(
        util.readdirSync(
          path.join(__dirname, '../'),
          /node_modules/
        )
      ).to.not.include('node_modules');
    });
  });
}

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
      })).to.equal('--name true');
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
      })).to.equal('--name hello --num 1 --real true');
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
      expect(util.envParse(['--name', '123'])).to.deep.equal({
        name: 123
      });
    });
  });
}


if (TEST_CTRL.OPEN_BROWSER) {
  describe('util.openBrowser(address)', () => {
    it('useage test', function() {
        expect(util.openBrowser('http://www.yy.com'));
    });
  });
}

if (TEST_CTRL.BUILD_TREE) {
  describe('util.buildTree(op)', () => {
    it('util.buildTree({frontPath, path, dirFilter, dirNoDeep}) test', () => {
      expect(util.buildTree({
        frontPath: 'yyl-util',
        path: path.join(__dirname, '..'),
        dirFilter: /\.svn|\.git|\.sass-cache|node_modules|gulpfile\.js|package\.json|webpack\.config\.js|config\.mine\.js/,
        dirNoDeep: ['html', 'js', 'css', 'dist', 'images', 'sass', 'components']
      }));
    });
    it('util.buildTree({path, dirList}) test', () => {
      expect(util.buildTree({
        path: 'yyl-util',
        dirList: [
          'yyl-util/images/1.png',
          'yyl-util/js/1.js',
          'yyl-util/js/lib/lib.js',
          'yyl-util/css/1.css',
          'yyl-util/html/1.html'
        ]
      }));
    });
  });
}

if (TEST_CTRL.FIND_PATH_SYNC) {
  describe('util.findPathSync(iPath, root, filter, ignoreHide)', () => {
    it('useage test', () => {
      fn.frag.build();

      fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, '03.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, '04.txt'), '123');
      expect(util.findPathSync('test.js', FRAG_PATH, /02\.txt/, true));

      fn.frag.destory();
    });
  });
}


if (TEST_CTRL.REQUIRE_JS) {
  describe('util.requireJs(iPath)', () => {
    it('useage test', () => {
      expect(util.requireJs('../lib/yyl-util.js')).not.equal(undefined);
    });
    it('cache test', function(done) {
      this.timeout(0);
      fn.frag.destory();
      fn.frag.build();
      const FRAG_JS_PATH = util.path.join(FRAG_PATH, '01.js');
      const param = {
        i: 1
      };
      fs.writeFileSync(FRAG_JS_PATH, `module.exports=${JSON.stringify(param)}`);

      expect(util.requireJs(FRAG_JS_PATH)).to.deep.equal(param);

      param.i = 2;
      fs.writeFileSync(FRAG_JS_PATH, `module.exports=${JSON.stringify(param)}`);
      expect(util.requireJs(FRAG_JS_PATH)).to.deep.equal(param);
      fn.frag.destory();
      done();
    });
  });
}

if (TEST_CTRL.MKDIR_SYNC) {
  describe('util.mkdirSync(toFile)', () => {
    it('useage test', () => {
      fn.frag.build();
      expect(util.mkdirSync(path.join(FRAG_PATH, '1/2/3/4/5/6/7')));
      fn.frag.destory();
    });
  });
}

if (TEST_CTRL.MAKE_CSS_JS_DATE) {
  describe('util.makeCssJsDate()', () => {
    it('usage test', () => {
      expect(util.makeCssJsDate());
    });
  });
}

if (TEST_CTRL.OPEN_PATH) {
  describe('util.openPath(iPath)', () => {
    it('useage test', function() {
        expect(util.openPath(__dirname));
    });
  });
}

if (TEST_CTRL.JOIN_FORMAT) {
  describe('util.joinFormat()', () => {
    it('web url test', () => {
      expect(util.joinFormat('http://www.yy.com/991')).to.equal('http://www.yy.com/991');
      expect(util.joinFormat('https://www.yy.com/991')).to.equal('https://www.yy.com/991');
      expect(util.joinFormat('//www.yy.com/991')).to.equal('//www.yy.com/991');
    });
    it('file path test', () => {
      expect(util.joinFormat('./../test/test.js')).to.equal('../test/test.js');
      expect(util.joinFormat('.\\..\\test\\test2.js')).to.equal('../test/test2.js');
    });
  });
}

if (TEST_CTRL.RUN_CMD) {
  describe('util.runCMD(str, callback, path, showOutput)', () => {
    it('callback test', (done) => {
      expect(util.runCMD('cd ..', (err) => {
        expect(Boolean(err)).to.be.equal(false);
        done();
      }, __dirname));
    });

    it('showOutput false test', (done) => {
      expect(util.runCMD('cd ..', (err) => {
        expect(Boolean(err)).to.be.equal(false);
        done();
      }, __dirname, false));
    });

    it('short argu test', () => {
      expect(util.runCMD('cd ..'));
      expect(util.runCMD('cd ..', null, __dirname, false));
      expect(util.runCMD('cd ..', null, null, false));
    });
  });
}

if (TEST_CTRL.RUN_SPAWN) {
  describe('util.runSpawn(ctx, done, iPath, showOutput)', () => {
    it('callback test', (done) => {
      expect(util.runSpawn('git --version', (err) => {
        expect(Boolean(err)).to.be.equal(false);
        done();
      }, __dirname));
    });

    it('showOutput false test', (done) => {
      expect(util.runSpawn('git --version', (err) => {
        expect(Boolean(err)).to.be.equal(false);
        done();
      }, __dirname, false));
    });

    it('short argu test', () => {
      expect(util.runSpawn('cd ..'));
      expect(util.runSpawn('cd ..', null, __dirname, false));
      expect(util.runSpawn('cd ..', null, null, false));
    });
  });
}

if (TEST_CTRL.RUN_NODE_MODULE) {
  describe('util.runNodeModule(ctx, done, op)', () => {
    it('useage test', function(done) {
      this.timeout(0);
      expect(util.runNodeModule('yyl', (err) => {
        expect(Boolean(err)).to.be.equal(false);
        done();
      }, __dirname));
    });
  });
}

if (TEST_CTRL.REMOVE_FILES) {
  describe('util.removeFiles(list, callback, filters)', () => {
    it('callback test', (done) => {
      util.mkdirSync(path.join(__dirname, '1/2/3/4'));
      util.removeFiles(path.join(__dirname, '1'), (err, files) => {
        expect(err).to.be.equal(undefined);
        expect(files.length).to.be.equal(4);
        done();
      }, null, true);
    });

    it('remove files include itself by short argu', () => {
      util.mkdirSync(path.join(__dirname, '1/2/3/4'));
      expect(util.removeFiles(path.join(__dirname, '1'), true).length).to.equal(4);
      expect(fs.existsSync(path.join(__dirname, '1'))).to.equal(false);
    });

    it('filter test', () => {
      util.mkdirSync(path.join(__dirname, '1'));
      fs.writeFileSync(path.join(__dirname, '1/1.txt'), 'hello');
      fs.writeFileSync(path.join(__dirname, '1/2.txt'), 'hello');

      expect(util.removeFiles(path.join(__dirname, '1'), /1\.txt$/).length).to.equal(1);
      expect(fs.existsSync(path.join(__dirname, '1/1.txt'))).to.equal(true);
    });

    it('remove files except itself by short argu', () => {
      util.mkdirSync(path.join(__dirname, '1/2/3/4'));

      expect(util.removeFiles(path.join(__dirname, '1')).length).to.equal(4);
      expect(fs.existsSync(path.join(__dirname, '1'))).to.equal(true);
      expect(util.removeFiles(path.join(__dirname, '1'), true));
    });
  });
}

if (TEST_CTRL.PROMISE) {
  describe('util.Promise()', () => {
    it('queue test', (done) => {
      const result = [];
      new util.Promise(((next) => {
        setTimeout(() => {
          result.push(1);
          next();
        }, 50);
      })).then((next) => {
        setTimeout(() => {
          result.push(2);
          next();
        }, 50);
      }).then((next) => {
        setTimeout(() => {
          result.push(3);
          next();
        }, 50);
      }).then(() => {
        expect(result).to.deep.equal([1, 2, 3]);
        done();
      }).start();
    });
  });
}

if (TEST_CTRL.READ_FILES_SYNC) {
  describe('util.readFilesSync(iPath, filter)', () => {
    it('useage test', () => {
      fn.frag.build();
      fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
      expect(util.readFilesSync(FRAG_PATH)).to.deep.equal([util.joinFormat(FRAG_PATH, '01.txt')]);
      fn.frag.destory();
    });
    it('filter regex test', () => {
      fn.frag.build();
      util.mkdirSync(path.join(FRAG_PATH, 'one'));
      util.mkdirSync(path.join(FRAG_PATH, 'two'));

      fs.writeFileSync(path.join(FRAG_PATH, 'one/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/03.txt'), '123');

      fs.writeFileSync(path.join(FRAG_PATH, 'two/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/03.txt'), '123');
      const files = util.readFilesSync(FRAG_PATH, /one/);
      expect(files).to.deep.equal([
        util.path.join(FRAG_PATH, 'one/01.txt'),
        util.path.join(FRAG_PATH, 'one/02.txt'),
        util.path.join(FRAG_PATH, 'one/03.txt')
      ]);
      fn.frag.destory();
    });

    it('filter regex reverse test', () => {
      fn.frag.build();
      util.mkdirSync(path.join(FRAG_PATH, 'one'));
      util.mkdirSync(path.join(FRAG_PATH, 'two'));

      fs.writeFileSync(path.join(FRAG_PATH, 'one/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/03.txt'), '123');

      fs.writeFileSync(path.join(FRAG_PATH, 'two/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/03.txt'), '123');
      const files = util.readFilesSync(FRAG_PATH, /one/, true);
      expect(files).to.deep.equal([
        util.path.join(FRAG_PATH, 'two/01.txt'),
        util.path.join(FRAG_PATH, 'two/02.txt'),
        util.path.join(FRAG_PATH, 'two/03.txt')
      ]);
      fn.frag.destory();
    });

    it('filter function test', () => {
      fn.frag.build();
      util.mkdirSync(path.join(FRAG_PATH, 'one'));
      util.mkdirSync(path.join(FRAG_PATH, 'two'));

      fs.writeFileSync(path.join(FRAG_PATH, 'one/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/03.txt'), '123');

      fs.writeFileSync(path.join(FRAG_PATH, 'two/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/03.txt'), '123');

      const files = util.readFilesSync(FRAG_PATH, (iPath) => {
        return /one/.test(iPath);
      });
      expect(files).to.deep.equal([
        util.path.join(FRAG_PATH, 'one/01.txt'),
        util.path.join(FRAG_PATH, 'one/02.txt'),
        util.path.join(FRAG_PATH, 'one/03.txt')
      ]);
      fn.frag.destory();
    });

    it('filter function reverse test', () => {
      fn.frag.build();
      util.mkdirSync(path.join(FRAG_PATH, 'one'));
      util.mkdirSync(path.join(FRAG_PATH, 'two'));

      fs.writeFileSync(path.join(FRAG_PATH, 'one/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'one/03.txt'), '123');

      fs.writeFileSync(path.join(FRAG_PATH, 'two/01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/02.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, 'two/03.txt'), '123');

      const files = util.readFilesSync(FRAG_PATH, (iPath) => {
        return /one/.test(iPath);
      }, true);
      expect(files).to.deep.equal([
        util.path.join(FRAG_PATH, 'two/01.txt'),
        util.path.join(FRAG_PATH, 'two/02.txt'),
        util.path.join(FRAG_PATH, 'two/03.txt')
      ]);
      fn.frag.destory();
    });
  });
}

if (TEST_CTRL.COPY_FILES) {
  describe('util.copyFiles(list, callback, filters, render, basePath)', () => {
    it('util.copyFiles(list, callback) test', (done) => {
      fn.frag.build();

      fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

      const obj = {};
      obj[
        path.join(FRAG_PATH, '01.txt')] = [path.join(FRAG_PATH2, '01.txt'),
        path.join(FRAG_PATH2, '02.txt')
      ];
      util.copyFiles(obj, (err, files) => {
        expect(
          fs.existsSync(path.join(FRAG_PATH2, '01.txt')) &&
          fs.existsSync(path.join(FRAG_PATH2, '02.txt'))
        ).to.equal(true);
        expect(files.length).to.equal(2);

        fn.frag.destory();
        done();
      });
    });
    it('util.copyFiles(fromFile, toFile, callback) test', (done) => {
      fn.frag.build();

      fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

      util.copyFiles(
        path.join(FRAG_PATH, '01.txt'),
        path.join(FRAG_PATH2, '01.txt'),
        () => {
          expect(fs.existsSync(path.join(FRAG_PATH2, '01.txt'))).to.equal(true);

          fn.frag.destory();
          done();
        }
      );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters-regExp) test', (done) => {
      fn.frag.build();

      fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');

      util.copyFiles(
        FRAG_PATH,
        FRAG_PATH2,
        () => {
          expect(
            fs.existsSync(path.join(FRAG_PATH2, '01.txt')) &&
                      !fs.existsSync(path.join(FRAG_PATH2, '02.txt'))
          ).to.equal(true);
          fn.frag.destory();
          done();
        },
        /02\.txt$/
      );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters-function) test', (done) => {
      fn.frag.build();

      fs.writeFileSync(path.join(FRAG_PATH, '03.txt'), '123');
      fs.writeFileSync(path.join(FRAG_PATH, '04.txt'), '123');

      util.copyFiles(
        FRAG_PATH,
        FRAG_PATH2,
        () => {
          expect(
            fs.existsSync(path.join(FRAG_PATH2, '03.txt')) &&
                      !fs.existsSync(path.join(FRAG_PATH2, '04.txt'))
          ).to.equal(true);
          fn.frag.destory();
          done();
        },
        (iPath) => {
          if (/04\.txt$/.test(iPath)) {
            return false;
          } else {
            return true;
          }
        }
      );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters, render) test', (done) => {
      fn.frag.build();

      fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '1');

      util.copyFiles(
        FRAG_PATH,
        FRAG_PATH2,
        () => {
          expect(
            fs.readFileSync(path.join(FRAG_PATH2, '01.txt')).toString()
          ).to.equal('101.txt');
          expect(fs.readFileSync(path.join(FRAG_PATH, '01.txt')).toString()).to.equal('1');
          fn.frag.destory();
          done();
        },
        null,
        (filePath, content) => {
          return content.toString() + path.parse(filePath).base;
        }
      );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters, null, basePath) test', (done) => {
      fn.frag.build();
      fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

      util.copyFiles(
        FRAG_PATH,
        FRAG_PATH2,
        () => {
          expect(fs.existsSync(path.join(FRAG_PATH2, '01.txt'))).to.equal(true);
          fn.frag.destory();
          done();
        },
        /frag/,
        null,
        FRAG_PATH
      );

      // TODO
      done();
    });
  });
}

if (TEST_CTRL.TIMER) {
  describe('util.timer', () => {
    it('useage test', (done) => {
      expect(util.timer.start());
      let padding = 5;
      const iKey = setInterval(() => {
        expect(util.timer.mark());
        padding--;
        if (!padding) {
          clearInterval(iKey);
          expect(util.timer.end());
          expect(util.timer.getNow());
          done();
        }
      }, 10);
    });
  });
}

if (TEST_CTRL.HELP) {
  describe('util.help', () => {
    it('util.help({ustage, commands, options}) test', () => {
      expect(util.help({
        usage: 'yyl',
        commands: {
          'key01': 'content01',
          'key02': 'content02',
          'key03': 'content03'
        },
        options: {
          '--help': 'content for help'
        }
      }));
    });
  });
}

if (TEST_CTRL.MSG) {
  describe('util.msg', () => {
    it('util.msg.init(op) test', () => {
      expect(util.msg.init({
        type: {
          'test01': 'red'
        }
      }));
      expect(util.msg.init({
        type: {
          'test02': '#ffdd00'
        }
      }));
      expect(util.msg.init({
        type: {
          'test03': {
            name: 'testname03',
            color: 'blue'
          }
        }
      }));
      expect(util.msg.init({
        type: {
          'test04': 'black',
          'test05': 'cyan',
          'test06': '#ffffff'
        },
        maxSize: 10
      }));

      expect(util.msg.test01('test 01'));
      expect(util.msg.test02('test 02'));
      expect(util.msg.test03('test 03'));
      expect(util.msg.test04('test 04'));
      expect(util.msg.test05('test 05'));
      expect(util.msg.test06('test 06'));
    });

    it('util.msg.del(msg) test', () => {
      expect(util.msg.del('test msg'));
      expect(util.msg.del('test msg', 'msg02', 'msg03'));
      expect(util.msg.del(['test msg', 'msg02', 'msg03']));
      expect(util.msg.del({
        'test': 'msg'
      }));
    });

    it('util.msg.success(msg) test', () => {
      expect(util.msg.success('test msg'));
      expect(util.msg.success('test msg', 'msg02', 'msg03'));
      expect(util.msg.success(['test msg', 'msg02', 'msg03']));
      expect(util.msg.success({
        'test': 'msg'
      }));
    });

    it('util.msg.info(msg) test', () => {
      expect(util.msg.info('test msg'));
      expect(util.msg.info('test msg', 'msg02', 'msg03'));
      expect(util.msg.info(['test msg', 'msg02', 'msg03']));
      expect(util.msg.info({
        'test': 'msg'
      }));
    });

    it('util.msg.warn(msg) test', () => {
      expect(util.msg.warn('test msg'));
      expect(util.msg.warn('test msg', 'msg02', 'msg03'));
      expect(util.msg.warn(['test msg', 'msg02', 'msg03']));
      expect(util.msg.warn({
        'test': 'msg'
      }));
    });

    it('util.msg.create(msg) test', () => {
      expect(util.msg.create('test msg'));
      expect(util.msg.create('test msg', 'msg02', 'msg03'));
      expect(util.msg.create(['test msg', 'msg02', 'msg03']));
      expect(util.msg.create({
        'test': 'msg'
      }));
    });

    it('other test', () => {
      expect(util.msg.replace('aaa'));
      expect(util.msg.replace('bbb'));
      expect(util.msg.line());
      expect(util.msg.newline());
      expect(util.msg.nowrap('testtesttesttesttesttesttesttesttesttesttest'));
    });

    it('util.msg.line() test', () => {
      expect(util.msg.line());
    });

    it('util.msg.line().success() test', () => {
      expect(util.msg.line().success('123'));
    });

    it('util.msg.newline() test', () => {
      expect(util.msg.newline());
    });

    it('util.msg.newline().success() test', () => {
      expect(util.msg.newline().success('123'));
    });

    it('util.msg.nowrap(txt, isNewLine) test', () => {
      expect(util.msg.nowrap('123', true));
    });

    it('util.msg.nowrap(txt, isNewLine).success() test', () => {
      expect(util.msg.nowrap('123', true).success('123'));
    });

    it('util.msg.silent(bool) test', () => {
      expect(util.msg.silent(true));
      expect(util.msg.silent(false));
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

if (TEST_CTRL.GET) {
  describe('util.get(url)', () => {
    // TODO
  });
}

if (TEST_CTRL.POP) {
  describe('util.pop(content)', () => {
    it('useage test', () => {
      expect(util.pop('test'));
    });
    it('queue test', (done) => {
      let padding = 5;
      const key = setInterval(() => {
        expect(util.pop(`test ${  padding}`));
        padding--;
        if (!padding) {
          clearInterval(key);
          done();
        }
      }, 100);
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

if (TEST_CTRL.TASK_QUEUE) {
  describe('util.taskQueue', () => {
    it('util.taskQueue.add(fn) test', (done) => {
      util.taskQueue.clear();
      let padding = 5;
      const r = [];

      const key = setInterval(() => {
        (function(padding) {
          util.taskQueue.add((next) => {
            const
              finish = function() {
                r.push(padding);
                next();
                if (!padding) {
                  expect(r).to.deep.equal([4, 3, 2, 1, 0]);
                  done();
                }
              };
            if (padding % 2) {
              finish();
            } else {
              setTimeout(() => {
                finish();
              }, 20);
            }
          });
        })(--padding);

        if (!padding) {
          clearInterval(key);
        }
      }, 100);
    });

    it('util.taskQueue.add(fn, delay) test', (done) => {
      util.taskQueue.clear();
      let padding = 5;
      const r = [];

      const key = setInterval(() => {
        (function(padding) {
          util.taskQueue.add((next) => {
            r.push(padding);
            if (!padding) {
              expect(r).to.deep.equal([0]);
              done();
            }

            next();
          }, 500);
        })(--padding);

        if (!padding) {
          clearInterval(key);
        }
      }, 50);
    });

    it('util.taskQueue.add(type, fn, delay) test', (done) => {
      util.taskQueue.clear();
      let p = 5;
      const r = [];
      const r2 = [];
      let rFinish = false;
      let r2Finish = false;

      const
        check = function() {
          if (rFinish && r2Finish) {
            done();
          }
        };

      const key = setInterval(() => {
        (function(p) {
          util.taskQueue.add('r', (next) => {
            const
              finish = function() {
                r.push(p);
                next();
                if (!p) {
                  expect(r).to.deep.equal([4, 3, 2, 1, 0]);
                  rFinish = true;
                  check();
                }
              };
            if (p % 2) {
              finish();
            } else {
              setTimeout(() => {
                finish();
              }, 20);
            }
          });
          util.taskQueue.add('r2', (next) => {
            const
              finish = function() {
                r2.push(p);
                next();
                if (!p) {
                  expect(r2).to.deep.equal([0]);
                  r2Finish = true;
                  check();
                }
              };
            if (p % 2) {
              finish();
            } else {
              setTimeout(() => {
                finish();
              }, 20);
            }
          }, 500);
        })(--p);

        if (!p) {
          clearInterval(key);
        }
      }, 100);
    });
  });
}

if (TEST_CTRL.DEBOUNCE) {
  describe('util.debounce(func, wait, immediate)', () => {
    it('useage test', (done) => {
      let padding = 5;
      let r = 0;
      const key = setInterval(() => {
        padding--;
        util.debounce(() => {
          r++;
          if (!padding) {
            padding--;
            expect(r).to.equal(2);
            done();
          }
        }, 40)();

        if (!padding) {
          clearInterval(key);
        }
      }, 10);
    });
  });
}

if (TEST_CTRL.MD_2_JSON) {
  describe('util.md2JSON(iPath)', () => {
    const
      cases = [{ // 标准文件
        testName: 'standard test',
        content: [
          '# title h1',
          '## title h2',
          '### title h3',
          '#### title h4',
          '##### title h5',
          '###### title h6',
          'normal text01',
          'normal text02',
          'normal text03',
          '* list 01',
          '* list 02',
          '* list 03',
          '1. num-list01',
          '2. num-list02',
          '3. num-list03'
        ].join('\r\n'),
        result: {
          type: 'root',
          children: [{
            type: 'h1',
            ctx: 'title h1',
            contents: [],
            children: [{
              type: 'h2',
              ctx: 'title h2',
              contents: [],
              children: [{
                type: 'h3',
                ctx: 'title h3',
                contents: [],
                children: [{
                  type: 'h4',
                  ctx: 'title h4',
                  contents: [],
                  children: [{
                    type: 'h5',
                    ctx: 'title h5',
                    contents: [],
                    children: [{
                      type: 'h6',
                      ctx: 'title h6',
                      contents: [{
                        type: 'text',
                        ctx: [
                          'normal text01',
                          'normal text02',
                          'normal text03'
                        ]
                      }, {
                        type: 'list',
                        ctx: [
                          'list 01',
                          'list 02',
                          'list 03'
                        ]

                      }, {
                        type: 'num-list',
                        ctx: [
                          'num-list01',
                          'num-list02',
                          'num-list03'
                        ]
                      }],
                      children: []

                    }]

                  }]

                }]
              }]

            }]
          }]

        }
      }, { // 空文件
        testName: 'blank file test',
        content: [].join('\r\n'),
        result: {
          type: 'root',
          children: []
        }
      }, {
        testName: 'siblings test',
        content: [
          '# h101',
          '# h102',
          'hello text'
        ].join('\r\n'),
        result: {
          type: 'root',
          children: [{
            type: 'h1',
            ctx: 'h101',
            contents: [],
            children: []

          }, {
            type: 'h1',
            ctx: 'h102',
            contents: [{
              type: 'text',
              ctx: ['hello text']
            }],
            children: []

          }]
        }
      }, {
        testName: 'h1 hide(h2) h3 test',
        content: [
          '# h1',
          '### h301',
          '### h302',
          '## h2'
        ].join('\n'),
        result: {
          type: 'root',
          children: [{
            type: 'h1',
            ctx: 'h1',
            contents: [],
            children: [{
              type: 'h2',
              ctx: '',
              contents: [],
              children: [{
                type: 'h3',
                ctx: 'h301',
                contents: [],
                children: []

              }, {
                type: 'h3',
                ctx: 'h302',
                contents: [],
                children: []

              }]
            }, {
              type: 'h2',
              ctx: 'h2',
              contents: [],
              children: []
            }]

          }]
        }

      }, {
        testName: 'script test',
        content: [
          '# h1',
          '```javascript',
          '### line1',
          '## line2',
          '```',
          '```javascript',
          '### line3',
          '## line4',
          '```',
          'hello text'
        ].join('\n'),
        result: {
          type: 'root',
          children: [{
            type: 'h1',
            ctx: 'h1',
            contents: [{
              type: 'script',
              syntax: 'javascript',
              ctx: [
                '### line1',
                '## line2'
              ]
            }, {
              type: 'script',
              syntax: 'javascript',
              ctx: [
                '### line3',
                '## line4'
              ]
            }, {
              type: 'text',
              ctx: [
                'hello text'
              ]
            }],
            children: []
          }]
        }

      }, {
        testName: 'h1 h2 style02 test',
        content: [
          'h1',
          '===',
          '# h2',
          '-----------------',
          'hello text'
        ].join('\n'),
        result: {
          type: 'root',
          children: [{
            type: 'h1',
            ctx: 'h1',
            contents: [],
            children: [{
              type: 'h2',
              ctx: '# h2',
              contents: [{
                type: 'text',
                ctx: ['hello text']
              }],
              children: []
            }]
          }]
        }

      }];


    cases.forEach((item) => {
      if (!item.testName) {
        return;
      }

      it(item.testName, (done) => {
        fn.frag.build();
        // 创建 md
        const mdPath = path.join(FRAG_PATH, '1.md');
        fs.writeFileSync(mdPath, item.content);

        util.md2JSON(mdPath);
        expect(util.md2JSON(mdPath)).to.deep.equal(item.result);

        fn.frag.destory();
        done();
      });
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

  describe('util.path.formatUrl(url) test', () => {
    it('usage test', () => {
      const r = 'css/base.css';
      expect(util.path.formatUrl('js/../css/base.css')).to.equal(r);
      expect(util.path.formatUrl('js/lib/../../css/base.css')).to.equal(r);
      expect(util.path.formatUrl('js/lib/main/../../../css/base.css')).to.equal(r);
      expect(util.path.formatUrl('./css/base.css')).to.equal(r);
      expect(util.path.formatUrl('././css/base.css')).to.equal(r);
      expect(util.path.formatUrl('./././css/base.css')).to.equal(r);
      expect(util.path.formatUrl('../css/base.css')).to.equal('../css/base.css');
    });

    it('http: test', () => {
      const r = 'http://web.yystatic.com/static/css/base.css';
      expect(
        util.path.formatUrl('http://web.yystatic.com/static/js/../css/base.css')
      ).to.equal(r);
    });

    it('https: test', () => {
      const r = 'https://web.yystatic.com/static/css/base.css';
      expect(
        util.path.formatUrl('https://web.yystatic.com/static/js/../css/base.css')
      ).to.equal(r);
    });
    it('// test', () => {
      const r = '//web.yystatic.com/static/css/base.css';
      expect(util.path.formatUrl('//web.yystatic.com/static/js/../css/base.css')).to.equal(r);
    });
    it('/ test', () => {
      const r = '/static/css/base.css';
      expect(util.path.formatUrl('/static/js/../css/base.css')).to.equal(r);
    });

    it('file: test', () => {
      const r = 'file:///C:/static/css/base.css';
      expect(util.path.formatUrl('file:///C:/static/js/../css/base.css')).to.equal(r);
    });

    it('data: test', () => {
      const r = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFOEE4M0I5MzVGRTcxMUU3QkIyMUY0QjdDNjNEOTVGOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFOEE4M0I5NDVGRTcxMUU3QkIyMUY0QjdDNjNEOTVGOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU4QTgzQjkxNUZFNzExRTdCQjIxRjRCN0M2M0Q5NUY4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU4QTgzQjkyNUZFNzExRTdCQjIxRjRCN0M2M0Q5NUY4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KyjrvAAABYxJREFUeNrMWg1MVWUYfi4XAgkRFEMNScl+sDSyFv1jrCRzJpnmUvsTC5jZFpmLubZmtVyi2XSiRrMGQc1YzUqlzDSqmRUrRuL4UUEX5k+Qyo/5c3peznc5l3G559w/4N2ece+57/m+53vP971/B5tWD18lirhXYSIRT1xBXK5+byWOE41EJVFO7CFafJnU5iXxUGIWMZ94gLB7eP9FYidRSHxKnAs08UFENpFDXAn/yF/EKiKfaA8E8anEWuJqBEaEyWJiuxXlIAs6YcR6YlsASUONvU3NFearxWOJL4lb0bdSQTxE/O2NxROIH/qBtMgkNfdYT4nHEd8S49B/InPvUlwsEQ8nthJj0P8yRnEJt0J8DXEzBo4Il3fNDqcciK8wMGWa8jo9iIsLqgqwy/NFDhI3EB3yJdjph2xPSf9RDRw6CgxmVnLLjUxaIt3EeAb5ahrpMPWHRev6l4V4RDxBcXzH2eKhakWjrIzw+TfA0hVA7WHjmpCYxdi6/EWuPt643toG5BUwqhQx0zplXI8ewjD5JJBLKmGhlsk3qQV0QIgT8wjNDBdroeVkQOONvSJ8ELRNb+r6v22FljDavf6dk6Cd+NV8bicI1y6L7yDSzJabuxJYscH4PnwowIlxhHao+LO7bjpzxjImsO0dxrWRTHaTEvUnVddgXE9OAnYXW7Z8GfGgWDuKuGC20j0l0Gw2w1JzH4bWWmX8vrcU2sTrXVuV20IreAvahRpd91IdtLxcaHa7ofNKlmWLC9cosfgM2bZmy0x5HPh+n/55xv3AZ7Q8F9JNxLrPLQOKnEbjYlDKtGncVT3H3EArZ7+qoh4T5kYG+WFRlqyeLsS5AbDEbcLMVCfuLpqFtgmhHzrI+iVuRO/63+1lifMzSyEe9fnpvXsPGS95JvBLpf79fR74BbMtEV8l7jDRTGt/nT6JYz+6Iy1y3+06TFNTPrGZaQbxqhrL3iVRQv41ZlqnWrofMH/KqFineZqtJ2BCfISZVky08flok3+JS2ByyNAoy7fFCPFIM60J1zEbU+nYPj7W+kb/EX9kChOkycAdTKUWPWH5tgg5nJoVzbSnga/LjT284wOPQ7Y/5T+x42krmq8zlNvthteY/ixwtq3fiJ8V4sesaN52E6Pmy8Z3sX7qPODEP97N/HbBECROjev864WcFOK1VrWX0Mpv5BiBR9zY3Y/pGZ+nkl8cidZ2GzZ+Mtgb4nVC/IAndyxbBDCJ6to2NYeYrzBoVB7w0Jtc0v+eP2/zhnh1kOrleSQL5wBb1hlJUdNxPSWQaNlHUi5eRbznSS/6f51E07OAFnW8ZSHFa3QX52pPy7ZwZ+GQEA2Zc85g6cJ/zfqOw4NU13SnN8tOSSb5EiOadpwDZj/PrfRxT10z0o5ts7nUdM9L26TZUeUXevvMJPv7aQtw7VgjEmYyQ1y+1shvRMSSYlF3Ehys4ZlHz5hNWehcuoWp0m2ktwsQtzgtw0iYOpsicQDzdMTG9NSPnzy663Pj7iMel24Oi0udstKX0yLV0K6PgCn3GNfETZaV+/VQ5jmqfOeGUL6yutcSEQ588R7A6kjv5IzX01ZXYg8yDqQH7Yn1rjpZspLFvppE8pei1cC611hHluiLcSXZc08jPEz3IhblBYe1XXWyRAqIjAHWDNpMLHDXgnM0PX8kkgYI6d8JFo5oM2t6isJ0omEAkG5QXNqsdGs7Cx0i1dfD6odeYariAqvEHTfKI6roB9IVau5eDWf28uqYGmBTH5LeqOZ0WydYeesmLigTen+6PoCEZWzpz2c5uz1fiDtEmuoTiJdU6PWXNKkxZeztVm/y9ZX4U+oAefNKXF5MfYg+eiXuSqTrkqL25XiVBEmbJ8JR2EJ/XykHbb+KEfJPCM2+TPq/AAMAaYIpSV81Fh0AAAAASUVORK5CYII=';
      expect(util.path.formatUrl(r)).to.equal(r);
    });

    it('about:blank test', () => {
      const r = 'about:blank';
      expect(util.path.formatUrl(r)).to.equal(r);
    });

    it('javascript test', () => {
      const r = 'javascript:void(0);';
      expect(util.path.formatUrl(r)).to.equal(r);
    });
  });
}



if (TEST_CTRL.CHECK_PORT_USEAGE) {
  describe('util.checkPortUseage(port) test', () => {
    it('useage test', () => {
      const server = net.createServer().listen(1234);
      server.on('listening', () => {
        util.checkPortUseage(1234, (canUse) => {
          expect(canUse).to.equal(false);
          server.close();
        });
        util.checkPortUseage(4321, (canUse) => {
          expect(canUse).to.equal(true);
        });
      });
    });
  });
}


if (TEST_CTRL.GET_TIME) {
  describe('util.getTime()', () => {
    it('useage test', () => {
      expect(util.getTime());
      expect(util.getTime('2017-12-15 07:09:00')).to.equal('07:09:00');
    });
  });
}

if (TEST_CTRL.GET_STR_SIZE) {
  describe('util.getStrSize(str)', () => {
    it('useage test', () => {
      expect(util.getStrSize(
        `${chalk.red('012')}${chalk.blue('345')}${chalk.white('67')}${chalk.black('89')}`
      )).to.equal(10);
    });
  });
}

if (TEST_CTRL.SUBSTR) {
  describe('util.substr(str, begin, len)', () => {
    const str = `${chalk.red('012')}${chalk.blue('345')}${chalk.white('67')}${chalk.black('89')}`;
    const str2 = '12345678901234567890';
    it('useage test', () => {
      expect(util.substr(str, 0, 5)).to.equal(`${chalk.red('012')}${chalk.blue('34')}`);
      expect(util.substr(str, 3, 3)).to.equal(`${chalk.blue('345')}`);
      expect(util.substr(str, 0, 3)).to.equal(`${chalk.red('012')}`);
      expect(util.substr(str, 6, 2)).to.equal(`${chalk.white('67')}`);
      expect(util.substr(str, 3, 5)).to.equal(`${chalk.blue('345')}${chalk.white('67')}`);
      expect(util.substr(str2, 0, 15)).to.equal('123456789012345');
      expect(util.substr(chalk.red(str2), 0, 15)).to.equal(chalk.red('123456789012345'));
    });
  });
}


if (TEST_CTRL.INFO_BAR) {
  describe('util.infoBar test', () => {
    it('util.infoBar.init() test', () => {
      expect(
        util.infoBar.init({
          hightlight: {
            'A': 'magenta',
            'M': 'blue',
            'D': 'red',
            'type:number': 'gray'
          },
          head: {
            key: {
              'js': {
                name: 'JS',
                color: 'black',
                bgColor: 'bgYellow'
              }
            }
          }
        })
      );
    });
    it('util.infoBar.print() test usage', (done) => {
      const str = '111111111111111111111111111111111111111111111111111111111111111111111';
      const str2 = '22222222222222222222222222222222222222222222222222222222222222222222';
      const shortStr = '123';
      const shortStr2 = '456';
      expect(util.infoBar.js(shortStr).end());
      expect(util.infoBar.js(shortStr, shortStr2).end());
      expect(util.infoBar.js({ barLeft: str, barRight: shortStr, foot: util.getTime() }).end());
      expect(util.infoBar.js({ barLeft: shortStr, barRight: str, foot: util.getTime() }).end());
      expect(util.infoBar.js({ barLeft: str, barRight: str2, foot: util.getTime() }).end());
      expect(util.infoBar.js({ barLeft: str, barRight: shortStr }).end());
      expect(util.infoBar.js({ barLeft: shortStr, barRight: str }).end());
      expect(util.infoBar.js({ barLeft: str, barRight: str2 }).end());

      done();
    });
    it('util.infoBar.print() test usage with color', (done) => {
      const str = `${chalk.red('111')}1111111111111111111111111111111111111111111111111111111111111111`;
      const str2 = `${chalk.yellow('222')}22222222222222222222222222222222222222222222222222222222222222`;
      const shortStr = chalk.red('123');
      const shortStr2 = chalk.yellow('456');
      expect(util.infoBar.js(shortStr).end());
      expect(util.infoBar.js(shortStr, shortStr2).end());
      expect(util.infoBar.js({ barLeft: str, barRight: shortStr, foot: util.getTime() }).end());
      expect(util.infoBar.js({ barLeft: shortStr, barRight: str, foot: util.getTime() }).end());
      expect(util.infoBar.js({ barLeft: str, barRight: str2, foot: util.getTime() }).end());
      expect(util.infoBar.js({ barLeft: str, barRight: shortStr }).end());
      expect(util.infoBar.js({ barLeft: shortStr, barRight: str }).end());
      expect(util.infoBar.js({ barLeft: str, barRight: str2 }).end());

      done();
    });
    it('util.infoBar.print() test interval', function(done) {
      this.timeout(0);
      let i = 0;
      const intervalKey = setInterval(() => {
        if (i > 15) {
          expect(util.infoBar.end());
          expect(util.infoBar.done({
            barLeft: i,
            foot: `${new Date()}`.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1')
          }).end());
          clearInterval(intervalKey);
          done();
        } else {
          expect(util.infoBar.js({
            barLeft: i++,
            foot: `${new Date()}`.replace(/^.*(\d{2}:\d{2}:\d{2}).*$/, '$1')
          }));
        }
      }, 100);
    });
    it('util.infoBar.print() test interval without foot', function(done) {
      this.timeout(0);
      let i = 0;
      const intervalKey = setInterval(() => {
        if (i > 15) {
          expect(util.infoBar.end());
          expect(util.infoBar.done({
            barLeft: i
          }).end());
          clearInterval(intervalKey);
          done();
        } else {
          expect(util.infoBar.js({
            barLeft: i++
          }));
        }
      }, 100);
    });

    it('util.infoBar.print() test barLeft array', () => {
      expect(util.infoBar.js({
        barLeft: [
          '1111111111111111111111111111111111111111111111111111111111111111111111111111111',
          '2222222222222222222222222222222222222222222222222222222222222222222222222222222',
          '3333333333333333333333333333333333333333333333333333333333333333333333333333333',
          '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
          '1\n2\n3\n'
        ],
        barRight: '123'
      }).end());
      expect(util.infoBar.js({
        barLeft: [
          '11111111111111111111111111111111111111111111111111111111111111111111',
          '22222222222222222222222222222222222222222222222222222222222222222222',
          '33333333333333333333333333333333333333333333333333333333333333333333'
        ],
        foot: util.getTime(),
        barRight: '123'
      }).end());
    });
  });
}
