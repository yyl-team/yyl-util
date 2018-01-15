'use strict';
var
    util = require('../index.js'),
    expect = require('chai').expect,
    path = require('path'),
    fs = require('fs'),
    FRAG_PATH = path.join(__dirname, 'frag'),
    FRAG_PATH2 = path.join(__dirname, 'frag2');

var
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

describe('util.readdirSync(iPath, filter)', function() {
    it('usage test', function() {
        expect(
            util.readdirSync(
                path.join(__dirname, '../'),
                /node_modules/
            )
        ).to.not.include('node_modules');
    });
});

describe('util.envStringify(obj)', function() {
    it('string test', function() {
        expect(util.envStringify({
            name: 'sub'
        })).to.equal('--name sub');
    });

    it('boolean test', function() {
        expect(util.envStringify({
            name: true
        })).to.equal('--name true');
    });


    it('number test', function() {
        expect(util.envStringify({
            name: 123
        })).to.equal('--name 123');
    });

    it('muti test', function() {
        expect(util.envStringify({
            name: 'hello',
            num: 1,
            real: true
        })).to.equal('--name hello --num 1 --real true');
    });
});

describe('util.envParse(argv)', function() {
    it('function test', function() {
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

describe('util.openBrowser(address)', function() {
    // it('useage test', function() {
    //     expect(util.openBrowser('http://www.yy.com'));
    // });
});

describe('util.buildTree(op)', function() {
    it('util.buildTree({frontPath, path, dirFilter, dirNoDeep}) test', function() {
        expect(util.buildTree({
            frontPath: 'yyl-util',
            path: path.join(__dirname, '..'),
            dirFilter: /\.svn|\.git|\.sass-cache|node_modules|gulpfile\.js|package\.json|webpack\.config\.js|config\.mine\.js/,
            dirNoDeep: ['html', 'js', 'css', 'dist', 'images', 'sass', 'components']
        }));
    });
    it('util.buildTree({path, dirList}) test', function() {
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

describe('util.findPathSync(iPath, root, filter, ignoreHide)', function() {
    it('useage test', function() {
        fn.frag.build();

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '03.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '04.txt'), '123');
        expect(util.findPathSync('test.js', FRAG_PATH, /02\.txt/, true));

        fn.frag.destory();
    });
});

describe('util.requireJs(iPath)', function() {
    it('useage test', function() {
        expect(util.requireJs('../lib/yyl-util.js'));
    });
});

describe('util.mkdirSync(toFile)', function() {
    it('useage test', function() {
        fn.frag.build();
        expect(util.mkdirSync(path.join(FRAG_PATH, '1/2/3/4/5/6/7')));
        fn.frag.destory();
    });
});

describe('util.makeCssJsDate()', function() {
    it('usage test', function() {
        expect(util.makeCssJsDate());
    });
});

describe('util.openPath(iPath)', function() {
    // it('useage test', function() {
    //     expect(util.openPath(__dirname));
    // });
});

describe('util.joinFormat()', function() {
    it('web url test', function() {
        expect(util.joinFormat('http://www.yy.com/991')).to.equal('http://www.yy.com/991');
        expect(util.joinFormat('https://www.yy.com/991')).to.equal('https://www.yy.com/991');
        expect(util.joinFormat('//www.yy.com/991')).to.equal('//www.yy.com/991');
    });
    it('file path test', function() {
        expect(util.joinFormat('./../test/test.js')).to.equal('./../test/test.js');
        expect(util.joinFormat('.\\..\\test\\test.js')).to.equal('./../test/test.js');
    });
});

describe('util.runCMD(str, callback, path, showOutput)', function() {
    it('callback test', function(done) {
        expect(util.runCMD('cd ..', function(err) {
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname));
    });

    it('showOutput false test', function(done) {
        expect(util.runCMD('cd ..', function(err) {
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname, false));
    });

    it('short argu test', function() {
        expect(util.runCMD('cd ..'));
        expect(util.runCMD('cd ..', null, __dirname, false));
        expect(util.runCMD('cd ..', null, null, false));
    });
});

describe('util.runSpawn(ctx, done, iPath, showOutput)', function() {
    it('callback test', function(done) {
        expect(util.runSpawn('git --version', function(err) {
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname));
    });

    it('showOutput false test', function(done) {
        expect(util.runSpawn('git --version', function(err) {
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname, false));
    });

    it('short argu test', function() {
        expect(util.runSpawn('cd ..'));
        expect(util.runSpawn('cd ..', null, __dirname, false));
        expect(util.runSpawn('cd ..', null, null, false));
    });
});

describe('util.runNodeModule(ctx, done, op)', function() {
    it('useage test', function(done) {
        expect(util.runNodeModule('yyl', function(err) {
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname));
    });
});

describe('util.removeFiles(list, callback, filters)', function() {
    it('callback test', function(done) {
        util.mkdirSync(path.join(__dirname, '1/2/3/4'));
        util.removeFiles(path.join(__dirname, '1'), function(err) {
            expect(err).to.be.equal(undefined);
            done();
        }, null, true);
    });

    it('remove files include itself by short argu', function() {
        util.mkdirSync(path.join(__dirname, '1/2/3/4'));
        expect(util.removeFiles(path.join(__dirname, '1'), true));
        expect(fs.existsSync(path.join(__dirname, '1'))).to.equal(false);
    });

    it('filter test', function() {
        util.mkdirSync(path.join(__dirname, '1'));
        fs.writeFileSync(path.join(__dirname, '1/1.txt'), 'hello');
        fs.writeFileSync(path.join(__dirname, '1/2.txt'), 'hello');

        expect(util.removeFiles(path.join(__dirname, '1'), /1\.txt$/));
        expect(fs.existsSync(path.join(__dirname, '1/1.txt'))).to.equal(true);
    });

    it('remove files except itself by short argu', function() {
        util.mkdirSync(path.join(__dirname, '1/2/3/4'));

        expect(util.removeFiles(path.join(__dirname, '1')));
        expect(fs.existsSync(path.join(__dirname, '1'))).to.equal(true);
        expect(util.removeFiles(path.join(__dirname, '1'), true));
    });
});

describe('util.Promise()', function() {
    it('queue test', function(done) {
        var result = [];
        new util.Promise(function(next) {
            setTimeout(function() {
                result.push(1);
                next();
            }, 50);
        }).then(function(next) {
            setTimeout(function() {
                result.push(2);
                next();
            }, 50);
        }).then(function(next) {
            setTimeout(function() {
                result.push(3);
                next();
            }, 50);
        }).then(function() {
            expect(result).to.deep.equal([1, 2, 3]);
            done();
        }).start();
    });
});

describe('util.readFilesSync(iPath, filter)', function() {
    it('useage test', function() {
        fn.frag.build();
        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        expect(util.readFilesSync(FRAG_PATH)).to.deep.equal([util.joinFormat(FRAG_PATH, '01.txt')]);
        fn.frag.destory();
    });
    it('filter regex test', function() {
        expect(
            util.readFilesSync(
                path.join(__dirname, '../node_modules'),
                /^(?!.*?node_modules).*$/
            ).length
        ).to.equal(0);
    });

    it('filter function test', function() {
        fn.frag.build();

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '03.txt'), '123');
        expect(util.readFilesSync(FRAG_PATH, function(iPath) {
            return /01\.txt/.test(iPath);
        }).length).to.equal(1);

        fn.frag.destory();
    });
});

describe('util.copyFiles(list, callback, filters, render, basePath)', function() {
    it('util.copyFiles(list, callback) test', function(done) {
        fn.frag.build();

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

        var obj = {};
        obj[
            path.join(FRAG_PATH, '01.txt')] = [path.join(FRAG_PATH2, '01.txt'),
            path.join(FRAG_PATH2, '02.txt')
        ];
        util.copyFiles(obj, function() {
            expect(
                fs.existsSync(path.join(FRAG_PATH2, '01.txt')) &&
                fs.existsSync(path.join(FRAG_PATH2, '02.txt'))
            ).to.equal(true);

            fn.frag.destory();
            done();
        });
    });
    it('util.copyFiles(fromFile, toFile, callback) test', function(done) {
        fn.frag.build();

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

        util.copyFiles(
            path.join(FRAG_PATH, '01.txt'),
            path.join(FRAG_PATH2, '01.txt'),
            function() {
                expect(fs.existsSync(path.join(FRAG_PATH2, '01.txt'))).to.equal(true);

                fn.frag.destory();
                done();
            }
        );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters-regExp) test', function(done) {
        fn.frag.build();

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');

        util.copyFiles(
            FRAG_PATH,
            FRAG_PATH2,
            function() {
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

    it('util.copyFiles(fromFile, toFile, callback, filters-function) test', function(done) {
        fn.frag.build();

        fs.writeFileSync(path.join(FRAG_PATH, '03.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '04.txt'), '123');

        util.copyFiles(
            FRAG_PATH,
            FRAG_PATH2,
            function() {
                expect(
                    fs.existsSync(path.join(FRAG_PATH2, '03.txt')) &&
                    !fs.existsSync(path.join(FRAG_PATH2, '04.txt'))
                ).to.equal(true);
                fn.frag.destory();
                done();
            },
            function(iPath) {
                if (/04\.txt$/.test(iPath)) {
                    return false;
                } else {
                    return true;
                }
            }
        );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters, render) test', function(done) {
        fn.frag.build();

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '1');

        util.copyFiles(
            FRAG_PATH,
            FRAG_PATH2,
            function() {
                expect(
                    fs.readFileSync(path.join(FRAG_PATH2, '01.txt')).toString()
                ).to.equal('101.txt');
                expect(fs.readFileSync(path.join(FRAG_PATH, '01.txt')).toString()).to.equal('1');
                fn.frag.destory();
                done();
            },
            null,
            function(filePath, content) {
                return content.toString() + path.parse(filePath).base;
            }
        );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters, null, basePath) test', function(done) {
        fn.frag.build();
        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

        util.copyFiles(
            FRAG_PATH,
            FRAG_PATH2,
            function() {
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

describe('util.timer', function() {
    it('useage test', function(done) {
        expect(util.timer.start());
        var padding = 5;
        var iKey = setInterval(function() {
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

describe('util.help', function() {
    it('util.help({ustage, commands, options}) test', function() {
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

describe('util.msg', function() {
    it('util.msg.init(op) test', function() {
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

    it('util.msg.del(msg) test', function() {
        expect(util.msg.del('test msg'));
        expect(util.msg.del('test msg', 'msg02', 'msg03'));
        expect(util.msg.del(['test msg', 'msg02', 'msg03']));
        expect(util.msg.del({
            'test': 'msg'
        }));
    });

    it('util.msg.success(msg) test', function() {
        expect(util.msg.success('test msg'));
        expect(util.msg.success('test msg', 'msg02', 'msg03'));
        expect(util.msg.success(['test msg', 'msg02', 'msg03']));
        expect(util.msg.success({
            'test': 'msg'
        }));
    });

    it('util.msg.info(msg) test', function() {
        expect(util.msg.info('test msg'));
        expect(util.msg.info('test msg', 'msg02', 'msg03'));
        expect(util.msg.info(['test msg', 'msg02', 'msg03']));
        expect(util.msg.info({
            'test': 'msg'
        }));
    });

    it('util.msg.warn(msg) test', function() {
        expect(util.msg.warn('test msg'));
        expect(util.msg.warn('test msg', 'msg02', 'msg03'));
        expect(util.msg.warn(['test msg', 'msg02', 'msg03']));
        expect(util.msg.warn({
            'test': 'msg'
        }));
    });

    it('util.msg.create(msg) test', function() {
        expect(util.msg.create('test msg'));
        expect(util.msg.create('test msg', 'msg02', 'msg03'));
        expect(util.msg.create(['test msg', 'msg02', 'msg03']));
        expect(util.msg.create({
            'test': 'msg'
        }));
    });

    it('other test', function() {
        expect(util.msg.replace('aaa'));
        expect(util.msg.replace('bbb'));
        expect(util.msg.line());
        expect(util.msg.newline());
        expect(util.msg.nowrap('testtesttesttesttesttesttesttesttesttesttest'));
    });

    it('util.msg.line() test', function() {
        expect(util.msg.line());
    });

    it('util.msg.line().success() test', function() {
        expect(util.msg.line().success('123'));
    });

    it('util.msg.newline() test', function() {
        expect(util.msg.newline());
    });

    it('util.msg.newline().success() test', function() {
        expect(util.msg.newline().success('123'));
    });

    it('util.msg.nowrap(txt, isNewLine) test', function() {
        expect(util.msg.nowrap('123', true));
    });

    it('util.msg.nowrap(txt, isNewLine).success() test', function() {
        expect(util.msg.nowrap('123', true).success('123'));
    });

    it('util.msg.silent(bool) test', function() {
        expect(util.msg.silent(true));
        expect(util.msg.silent(false));
    });
});


describe('util.makeArray()', function() {
    it('useage test', function() {
        expect(util.makeArray({
            '0': 1,
            '1': 2,
            'length': 2
        })).to.deep.equal([1, 2]);
    });
});

describe('util.type()', function() {
    it('type array test', function() {
        expect(util.type([])).to.equal('array');
    });

    it('type object test', function() {
        expect(util.type({})).to.equal('object');
    });

    it('type function test', function() {
        expect(util.type(function() {})).to.equal('function');
    });

    it('type number test', function() {
        expect(util.type(1)).to.equal('number');
    });

    it('type undefined test', function() {
        expect(util.type(undefined)).to.equal('undefined');
    });

    it('type null test', function() {
        expect(util.type(null)).to.equal('null');
    });
});


describe('util.extend()', function() {
    it('sample test', function() {
        var
            obj01 = {
                a: 1
            },
            obj02 = {
                a: 2,
                b: 2
            },
            r = util.extend(obj01, obj02);

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

    it('deep test', function() {
        var
            obj01 = {
                a: 1,
                b: {
                    b1: 1,
                    b2: 2
                }
            },
            obj02 = {
                a: 2,
                b: {
                    b1: 2,
                    b2: 3,
                    b3: 4
                }
            },
            r = util.extend(true, obj01, obj02);

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

    it('extend test', function() {
        var
            obj01 = {
                a: 1,
                b: {
                    b1: 1,
                    b2: 2
                }
            },
            obj02 = {
                a: 2,
                b: {
                    b1: 2,
                    b2: 3,
                    b3: 4
                }
            },
            r = util.extend({}, obj01, obj02);

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

describe('util.get(url)', function() {
    // TODO
});

describe('util.pop(content)', function() {
    it('useage test', function() {
        expect(util.pop('test'));
    });
    it('queue test', function(done) {
        var padding = 5;
        var key = setInterval(function() {
            expect(util.pop('test ' + padding));
            padding--;
            if (!padding) {
                clearInterval(key);
                done();
            }
        }, 100);
    });
});

describe('util.compareVersion(v1, v2)', function() {
    it('normal compare', function() {
        expect(util.compareVersion('2.0.1', '2.0.0')).to.equal(1);
        expect(util.compareVersion('2.1.0', '2.0.0')).to.equal(1);
        expect(util.compareVersion('2.1.0', '2.0.1')).to.equal(1);
        expect(util.compareVersion('1.1.0', '2.0.0')).to.equal(-1);
    });
    it('^1.0.0, ~1.0.0, v1.0.0 version compare', function() {
        expect(util.compareVersion('^2.0.1', '2.0.0')).to.equal(1);
        expect(util.compareVersion('~2.1.0', '2.0.0')).to.equal(1);
        expect(util.compareVersion('v2.1.0', '2.0.1')).to.equal(1);
        expect(util.compareVersion('^1.1.0', '~2.0.0')).to.equal(-1);
    });
});

describe('util.taskQueue', function() {
    it('util.taskQueue.add(fn) test', function(done) {
        util.taskQueue.clear();
        var padding = 5;
        var r = [];

        var key = setInterval(function() {
            (function(padding) {
                util.taskQueue.add(function(next) {
                    var
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
                        setTimeout(function() {
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

    it('util.taskQueue.add(fn, delay) test', function(done) {
        util.taskQueue.clear();
        var padding = 5;
        var r = [];

        var key = setInterval(function() {
            (function(padding) {
                util.taskQueue.add(function(next) {
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

    it('util.taskQueue.add(type, fn, delay) test', function(done) {
        util.taskQueue.clear();
        var p = 5;
        var r = [];
        var r2 = [];
        var rFinish = false;
        var r2Finish = false;

        var
            check = function() {
                if (rFinish && r2Finish) {
                    done();
                }
            };

        var key = setInterval(function() {
            (function(p) {
                util.taskQueue.add('r', function(next) {
                    var
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
                        setTimeout(function() {
                            finish();
                        }, 20);
                    }
                });
                util.taskQueue.add('r2', function(next) {
                    var
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
                        setTimeout(function() {
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

describe('util.debounce(func, wait, immediate)', function() {
    it('useage test', function(done) {
        var padding = 5;
        var r = 0;
        var key = setInterval(function() {
            padding--;
            util.debounce(function() {
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

describe('util.md2JSON(iPath)', function() {
    var
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


    cases.forEach(function(item) {
        if (!item.testName) {
            return;
        }

        it(item.testName, function(done) {
            fn.frag.build();
            // 创建 md
            var mdPath = path.join(FRAG_PATH, '1.md');
            fs.writeFileSync(mdPath, item.content);

            util.md2JSON(mdPath);
            expect(util.md2JSON(mdPath)).to.deep.equal(item.result);

            fn.frag.destory();
            done();
        });
    });
});

describe('util.path.join() test', function() {
    it('web url test', function() {
        expect(util.path.join('http://www.yy.com/991')).to.equal('http://www.yy.com/991');
        expect(util.path.join('https://www.yy.com/991')).to.equal('https://www.yy.com/991');
        expect(util.path.join('//www.yy.com/991')).to.equal('//www.yy.com/991');
    });
    it('file path test', function() {
        expect(util.path.join('./../test/test.js')).to.equal('./../test/test.js');
        expect(util.path.join('.\\..\\test\\test.js')).to.equal('./../test/test.js');
    });
});

describe('util.path.relative() test', function() {
    it('file path test', function() {
        expect(util.path.relative('./../test/', './../test2/1.md')).to.equal('../test2/1.md');
        expect(util.path.relative('.\\..\\test\\', '.\\..\\test2\\1.md')).to.equal('../test2/1.md');
    });
});

describe('util.path.resolve() test', function() {
    it('file path test', function() {
        expect(util.path.relative('./../test/', './../test2/1.md')).to.equal('../test2/1.md');
        expect(util.path.relative('.\\..\\test\\', '.\\..\\test2\\1.md')).to.equal('../test2/1.md');
    });
});

describe('util.path.formatUrl(url) test', function() {
    it('usage test', function() {
        var r = 'css/base.css';
        expect(util.path.formatUrl('js/../css/base.css')).to.equal(r);
        expect(util.path.formatUrl('js/lib/../../css/base.css')).to.equal(r);
        expect(util.path.formatUrl('js/lib/main/../../../css/base.css')).to.equal(r);
        expect(util.path.formatUrl('./css/base.css')).to.equal(r);
        expect(util.path.formatUrl('././css/base.css')).to.equal(r);
        expect(util.path.formatUrl('./././css/base.css')).to.equal(r);
        expect(util.path.formatUrl('../css/base.css')).to.equal('../css/base.css');
    });

    it('http: test', function() {
        var r = 'http://web.yystatic.com/static/css/base.css';
        expect(
            util.path.formatUrl('http://web.yystatic.com/static/js/../css/base.css')
        ).to.equal(r);
    });

    it('https: test', function() {
        var r = 'https://web.yystatic.com/static/css/base.css';
        expect(
            util.path.formatUrl('https://web.yystatic.com/static/js/../css/base.css')
        ).to.equal(r);
    });
    it('// test', function() {
        var r = '//web.yystatic.com/static/css/base.css';
        expect(util.path.formatUrl('//web.yystatic.com/static/js/../css/base.css')).to.equal(r);
    });
    it('/ test', function() {
        var r = '/static/css/base.css';
        expect(util.path.formatUrl('/static/js/../css/base.css')).to.equal(r);
    });

    it('file: test', function() {
        var r = 'file:///C:/static/css/base.css';
        expect(util.path.formatUrl('file:///C:/static/js/../css/base.css')).to.equal(r);
    });

    it('data: test', function() {
        var r = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAYAAABXuSs3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFOEE4M0I5MzVGRTcxMUU3QkIyMUY0QjdDNjNEOTVGOCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFOEE4M0I5NDVGRTcxMUU3QkIyMUY0QjdDNjNEOTVGOCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkU4QTgzQjkxNUZFNzExRTdCQjIxRjRCN0M2M0Q5NUY4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkU4QTgzQjkyNUZFNzExRTdCQjIxRjRCN0M2M0Q5NUY4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+KyjrvAAABYxJREFUeNrMWg1MVWUYfi4XAgkRFEMNScl+sDSyFv1jrCRzJpnmUvsTC5jZFpmLubZmtVyi2XSiRrMGQc1YzUqlzDSqmRUrRuL4UUEX5k+Qyo/5c3peznc5l3G559w/4N2ece+57/m+53vP971/B5tWD18lirhXYSIRT1xBXK5+byWOE41EJVFO7CFafJnU5iXxUGIWMZ94gLB7eP9FYidRSHxKnAs08UFENpFDXAn/yF/EKiKfaA8E8anEWuJqBEaEyWJiuxXlIAs6YcR6YlsASUONvU3NFearxWOJL4lb0bdSQTxE/O2NxROIH/qBtMgkNfdYT4nHEd8S49B/InPvUlwsEQ8nthJj0P8yRnEJt0J8DXEzBo4Il3fNDqcciK8wMGWa8jo9iIsLqgqwy/NFDhI3EB3yJdjph2xPSf9RDRw6CgxmVnLLjUxaIt3EeAb5ahrpMPWHRev6l4V4RDxBcXzH2eKhakWjrIzw+TfA0hVA7WHjmpCYxdi6/EWuPt643toG5BUwqhQx0zplXI8ewjD5JJBLKmGhlsk3qQV0QIgT8wjNDBdroeVkQOONvSJ8ELRNb+r6v22FljDavf6dk6Cd+NV8bicI1y6L7yDSzJabuxJYscH4PnwowIlxhHao+LO7bjpzxjImsO0dxrWRTHaTEvUnVddgXE9OAnYXW7Z8GfGgWDuKuGC20j0l0Gw2w1JzH4bWWmX8vrcU2sTrXVuV20IreAvahRpd91IdtLxcaHa7ofNKlmWLC9cosfgM2bZmy0x5HPh+n/55xv3AZ7Q8F9JNxLrPLQOKnEbjYlDKtGncVT3H3EArZ7+qoh4T5kYG+WFRlqyeLsS5AbDEbcLMVCfuLpqFtgmhHzrI+iVuRO/63+1lifMzSyEe9fnpvXsPGS95JvBLpf79fR74BbMtEV8l7jDRTGt/nT6JYz+6Iy1y3+06TFNTPrGZaQbxqhrL3iVRQv41ZlqnWrofMH/KqFineZqtJ2BCfISZVky08flok3+JS2ByyNAoy7fFCPFIM60J1zEbU+nYPj7W+kb/EX9kChOkycAdTKUWPWH5tgg5nJoVzbSnga/LjT284wOPQ7Y/5T+x42krmq8zlNvthteY/ixwtq3fiJ8V4sesaN52E6Pmy8Z3sX7qPODEP97N/HbBECROjev864WcFOK1VrWX0Mpv5BiBR9zY3Y/pGZ+nkl8cidZ2GzZ+Mtgb4nVC/IAndyxbBDCJ6to2NYeYrzBoVB7w0Jtc0v+eP2/zhnh1kOrleSQL5wBb1hlJUdNxPSWQaNlHUi5eRbznSS/6f51E07OAFnW8ZSHFa3QX52pPy7ZwZ+GQEA2Zc85g6cJ/zfqOw4NU13SnN8tOSSb5EiOadpwDZj/PrfRxT10z0o5ts7nUdM9L26TZUeUXevvMJPv7aQtw7VgjEmYyQ1y+1shvRMSSYlF3Ehys4ZlHz5hNWehcuoWp0m2ktwsQtzgtw0iYOpsicQDzdMTG9NSPnzy663Pj7iMel24Oi0udstKX0yLV0K6PgCn3GNfETZaV+/VQ5jmqfOeGUL6yutcSEQ588R7A6kjv5IzX01ZXYg8yDqQH7Yn1rjpZspLFvppE8pei1cC611hHluiLcSXZc08jPEz3IhblBYe1XXWyRAqIjAHWDNpMLHDXgnM0PX8kkgYI6d8JFo5oM2t6isJ0omEAkG5QXNqsdGs7Cx0i1dfD6odeYariAqvEHTfKI6roB9IVau5eDWf28uqYGmBTH5LeqOZ0WydYeesmLigTen+6PoCEZWzpz2c5uz1fiDtEmuoTiJdU6PWXNKkxZeztVm/y9ZX4U+oAefNKXF5MfYg+eiXuSqTrkqL25XiVBEmbJ8JR2EJ/XykHbb+KEfJPCM2+TPq/AAMAaYIpSV81Fh0AAAAASUVORK5CYII=';
        expect(util.path.formatUrl(r)).to.equal(r);
    });

    it('about:blank test', function() {
        var r = 'about:blank';
        expect(util.path.formatUrl(r)).to.equal(r);
    });

    it('javascript test', function() {
        var r = 'javascript:void(0);';
        expect(util.path.formatUrl(r)).to.equal(r);
    });
});
