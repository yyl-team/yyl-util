'use strict';
var
    util = require('../index.js'),
    expect = require('chai').expect,
    path = require('path'),
    fs = require('fs'),
    FRAG_PATH = path.join(__dirname, '../frag'),
    FRAG_PATH2 = path.join(__dirname, '../frag2');



describe('util.readdirSync(iPath, filter)', function() {
    it('usage test', function() {
        expect(util.readdirSync(path.join(__dirname, '../'), /node_modules/)).to.not.include('node_modules');
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
            dirNoDeep: ['html', 'js', 'css', 'dist', 'images', 'sass', 'components'],
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
        util.mkdirSync(FRAG_PATH);
        util.removeFiles(FRAG_PATH);

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '03.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '04.txt'), '123');
        expect(util.findPathSync('test.js', FRAG_PATH, /02\.txt/, true));
    });
});

describe('util.requireJs(iPath)', function() {
    it('useage test', function() {
        expect(util.requireJs('../lib/yyl-util.js'));
    });
});

describe('util.mkdirSync(toFile)', function() {
    it('useage test', function() {
        util.mkdirSync(FRAG_PATH);
        util.removeFiles(FRAG_PATH);

        expect(util.mkdirSync(path.join(FRAG_PATH, '1/2/3/4/5/6/7')));
        util.removeFiles(path.join(FRAG_PATH), true);
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
        util.mkdirSync(FRAG_PATH);
        util.removeFiles(FRAG_PATH);
        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        expect(util.readFilesSync(FRAG_PATH)).to.deep.equal([util.joinFormat(FRAG_PATH, '01.txt')]);
        util.removeFiles(path.join(__dirname, '../frag'), true);
    });
    it('filter regex test', function() {
        expect(util.readFilesSync(path.join(__dirname, '../node_modules'), /^(?!.*?node_modules).*$/).length).to.equal(0);
    });

    it('filter function test', function() {
        util.mkdirSync(FRAG_PATH);
        util.removeFiles(FRAG_PATH);
        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '03.txt'), '123');
        expect(util.readFilesSync(path.join(__dirname, '../frag'), function(iPath) {
            return /01\.txt/.test(iPath);
        }).length).to.equal(1);
    });
});

describe('util.copyFiles(list, callback, filters, render, basePath)', function() {
    it('util.copyFiles(list, callback) test', function(done) {
        util.mkdirSync(FRAG_PATH);
        util.mkdirSync(FRAG_PATH2);
        util.removeFiles([FRAG_PATH, FRAG_PATH2]);

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

        var obj = {};
        obj[path.join(FRAG_PATH, '01.txt')] = [path.join(FRAG_PATH2, '01.txt'), path.join(FRAG_PATH2, '02.txt')];
        util.copyFiles(obj, function() {
            expect(fs.existsSync(path.join(FRAG_PATH2, '01.txt')) && fs.existsSync(path.join(FRAG_PATH2, '02.txt'))).to.equal(true);
            util.removeFiles(FRAG_PATH2, true);
            done();
        });
    });
    it('util.copyFiles(fromFile, toFile, callback) test', function(done) {
        util.mkdirSync(FRAG_PATH);
        util.mkdirSync(FRAG_PATH2);
        util.removeFiles([FRAG_PATH, FRAG_PATH2]);

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');

        util.copyFiles(
            path.join(FRAG_PATH, '01.txt'),
            path.join(FRAG_PATH2, '01.txt'),
            function() {
                expect(fs.existsSync(path.join(FRAG_PATH2, '01.txt'))).to.equal(true);
                util.removeFiles([FRAG_PATH, FRAG_PATH2], true);
                done();
            }
        );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters) test', function(done) {
        util.mkdirSync(FRAG_PATH);
        util.mkdirSync(FRAG_PATH2);
        util.removeFiles([FRAG_PATH, FRAG_PATH2]);

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '123');
        fs.writeFileSync(path.join(FRAG_PATH, '02.txt'), '123');

        util.copyFiles(
            FRAG_PATH,
            FRAG_PATH2,
            function() {
                expect(fs.existsSync(path.join(FRAG_PATH2, '01.txt')) && !fs.existsSync(path.join(FRAG_PATH2, '02.txt'))).to.equal(true);
                util.removeFiles([FRAG_PATH, FRAG_PATH2], true);
                done();
            },
            /02\.txt$/
        );
    });

    it('util.copyFiles(fromFile, toFile, callback, filters, render) test', function(done) {
        util.mkdirSync(FRAG_PATH);
        util.mkdirSync(FRAG_PATH2);
        util.removeFiles([FRAG_PATH, FRAG_PATH2]);

        fs.writeFileSync(path.join(FRAG_PATH, '01.txt'), '1');

        util.copyFiles(
            FRAG_PATH,
            FRAG_PATH2,
            function() {
                expect(fs.readFileSync(path.join(FRAG_PATH2, '01.txt')).toString()).to.equal('101.txt');
                expect(fs.readFileSync(path.join(FRAG_PATH, '01.txt')).toString()).to.equal('1');
                util.removeFiles([FRAG_PATH, FRAG_PATH2], true);
                done();
            },
            null,
            function(filePath, content) {
                return content.toString() + path.parse(filePath).base;
            }
        );

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
                'key03': 'content03',
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

    it('other test', function(){
        expect(util.msg.replace('aaa'));
        expect(util.msg.replace('bbb'));
        expect(util.msg.line());
        expect(util.msg.newline());
        expect(util.msg.nowrap('testtesttesttesttesttesttesttesttesttesttest'));

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
    it('useage test', function(){
        expect(util.pop('test'));
    });
    it('queue test', function(done){
        var padding = 5;
        var key = setInterval(function(){
            expect(util.pop('test ' + padding));
            padding--;
            if(!padding){
                clearInterval(key);
                done();
            }

        }, 100);

    });
});

describe('util.compareVersion(v1, v2)', function() {
    it('normal compare', function(){
        expect(util.compareVersion('2.0.1', '2.0.0')).to.equal(1);
        expect(util.compareVersion('2.1.0', '2.0.0')).to.equal(1);
        expect(util.compareVersion('2.1.0', '2.0.1')).to.equal(1);
        expect(util.compareVersion('1.1.0', '2.0.0')).to.equal(-1);
    });
    it('^1.0.0, ~1.0.0, v1.0.0 version compare', function(){
        expect(util.compareVersion('^2.0.1', '2.0.0')).to.equal(1);
        expect(util.compareVersion('~2.1.0', '2.0.0')).to.equal(1);
        expect(util.compareVersion('v2.1.0', '2.0.1')).to.equal(1);
        expect(util.compareVersion('^1.1.0', '~2.0.0')).to.equal(-1);

    });
});

describe('util.taskQueue', function() {
    it('util.taskQueue.add(fn) test', function(done){
        util.taskQueue.clear();
        var padding = 5;
        var r = [];

        var key = setInterval(function(){
            (function(padding){
                util.taskQueue.add(function(next){
                    var 
                        finish = function(){
                            r.push(padding);
                            next();
                            if(!padding){
                                expect(r).to.deep.equal([4,3,2,1,0]);
                                done();
                            }
                        };
                    if(padding % 2){
                        finish();
                    } else {
                        setTimeout(function(){
                            finish();
                        }, 20);
                    }

                });

            })(--padding);

            if(!padding){
                clearInterval(key);
            }
        }, 100);
    });

    it('util.taskQueue.add(fn, delay) test', function(done){
        util.taskQueue.clear();
        var padding = 5;
        var r = [];

        var key = setInterval(function(){
            (function(padding){
                util.taskQueue.add(function(next){
                    r.push(padding);
                    if(!padding){
                        expect(r).to.deep.equal([0]);
                        done();
                    }

                    next();

                }, 500);
            })(--padding);

            if(!padding){
                clearInterval(key);
            }
        }, 50);
    });

    it('util.taskQueue.add(type, fn, delay) test', function(done){
        util.taskQueue.clear();
        var p = 5;
        var r = [];
        var r2 = [];
        var rFinish = false;
        var r2Finish = false;

        var 
            check = function(){
                if(rFinish && r2Finish){
                    done();
                }
            };

        var key = setInterval(function(){
            (function(p){
                util.taskQueue.add('r', function(next){
                    var 
                        finish = function(){
                            r.push(p);
                            next();
                            if(!p){
                                expect(r).to.deep.equal([4,3,2,1,0]);
                                rFinish = true;
                                check();
                            }
                        };
                    if(p % 2){
                        finish();
                    } else {
                        setTimeout(function(){
                            finish();
                        }, 20);
                    }

                });

                util.taskQueue.add('r2', function(next){
                    var 
                        finish = function(){
                            r2.push(p);
                            next();
                            if(!p){
                                expect(r2).to.deep.equal([0]);
                                r2Finish = true;
                                check();
                            }
                        };
                    if(p % 2){
                        finish();
                    } else {
                        setTimeout(function(){
                            finish();
                        }, 20);
                    }

                }, 500);

            })(--p);

            if(!p){
                clearInterval(key);
            }
        }, 100);
    });

});

describe('util.debounce(func, wait, immediate)', function() {
    it('useage test', function(done){
        var padding = 5;
        var r = 0;
        var key = setInterval(function(){
            padding--;
            util.debounce(function(){
                r++;
                if(!padding){
                    padding--;
                    expect(r).to.equal(2);
                    done();
                }
            }, 40)();

            if(!padding){
                clearInterval(key);
            }

        }, 10);

    });
});

describe('util.md2JSON(iPath)', function() {
    var cases = [{ // 标准文件
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
                type: "root",
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
                                                'normal text03',
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

    

    cases.forEach(function(item){
        if(!item.testName){
            return;
        }

        it(item.testName, function(done){
            // 创建 md
            util.mkdirSync(FRAG_PATH);
            util.removeFiles(FRAG_PATH);
            var mdPath = path.join(FRAG_PATH, '1.md');
            fs.writeFileSync(mdPath, item.content);

            util.md2JSON(mdPath);
            expect(util.md2JSON(mdPath)).to.deep.equal(item.result);

            util.removeFiles(FRAG_PATH, true);
            done();

        });
        
    });
    
});


