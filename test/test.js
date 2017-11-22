'use strict';
var
    util = require('../index.js'),
    expect = require('chai').expect,
    path = require('path'),
    fs = require('fs');



describe('util.readdirSync(iPath, filter)', function() {
    it('function test', function() {
        expect(util.readdirSync(path.join(__dirname, '../'), /node_modules/)).to.not.include('node_modules');
    });
});

describe('util.envStringify(obj)', function() {
    it('function test', function() {
        expect(util.envStringify({ name: 'sub' })).to.equal('--name sub');
        expect(util.envStringify({ name: true })).to.equal('--name true');
        expect(util.envStringify({ name: 123 })).to.equal('--name 123');
    });
});

describe('util.envParse(argv)', function() {
    it('function test', function() {
        expect(util.envParse('--name sub')).to.deep.equal({ name: 'sub' });
        expect(util.envParse('--name true')).to.deep.equal({ name: true });
        expect(util.envParse('--name 123')).to.deep.equal({ name: 123 });

        expect(util.envParse(['--name', 'sub'])).to.deep.equal({ name: 'sub' });
        expect(util.envParse(['--name', 'true'])).to.deep.equal({ name: true });
        expect(util.envParse(['--name', '123'])).to.deep.equal({ name: 123 });
    });
});

describe('util.openBrowser(address)', function() {
    it('function test', function() {
        expect(util.openBrowser('http://www.yy.com'));
    });
});

describe('util.buildTree(op)', function() {
    it('function test', function() {
        expect(util.buildTree({
            frontPath: 'yyl-util',
            path: path.join(__dirname, '..'),
            dirFilter: /\.svn|\.git|\.sass-cache|node_modules|gulpfile\.js|package\.json|webpack\.config\.js|config\.mine\.js/,
            dirNoDeep: ['html', 'js', 'css', 'dist', 'images', 'sass', 'components'],
        }));

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
    it('function test', function() {
        expect(util.findPathSync('test.js', path.join(__dirname, '../../yyl-util'), /node_modules/, true));
    });
});

describe('util.requireJs(iPath)', function() {
    it('function test', function() {
        expect(util.requireJs('../lib/yyl-util.js'));
    });
});

describe('util.mkdirSync(toFile)', function() {
    it('function test', function() {
        expect(util.mkdirSync(path.join(__dirname, '1/2/3/4/5/6/7')));
        util.removeFiles(path.join(__dirname, '1'), true);
    });
});

describe('util.makeCssJsDate()', function() {
    it('function test', function() {
        expect(util.makeCssJsDate());
    });
});

describe('util.openPath(iPath)', function() {
    it('function test', function() {
        expect(util.openPath(__dirname));
    });
});

describe('util.joinFormat()', function(){
    it('function test', function(){
        expect(util.joinFormat('http://www.yy.com/991')).to.equal('http://www.yy.com/991');
        expect(util.joinFormat('//www.yy.com/991')).to.equal('//www.yy.com/991');
        expect(util.joinFormat('./../test/test.js')).to.equal('./../test/test.js');
        expect(util.joinFormat('.\\..\\test\\test.js')).to.equal('./../test/test.js');
    });
});

describe('util.runCMD(str, callback, path, showOutput)', function(){
    it('callback test', function(done){
        expect(util.runCMD('cd ..', function(err){
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname));

    });

    it('showOutput false test', function(done){
        expect(util.runCMD('cd ..', function(err){
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname, false));
    });

    it('short argu test', function(){
        expect(util.runCMD('cd ..'));
        expect(util.runCMD('cd ..', null, __dirname, false));
        expect(util.runCMD('cd ..', null, null, false));

    });

});

describe('util.runSpawn(ctx, done, iPath, showOutput)', function(){
    it('callback test', function(done){
        expect(util.runSpawn('git --version', function(err){
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname));

    });

    it('showOutput false test', function(done){
        expect(util.runSpawn('git --version', function(err){
            expect(Boolean(err)).to.be.equal(false);
            done();
        }, __dirname, false));
    });

    it('short argu test', function(){
        expect(util.runSpawn('cd ..'));
        expect(util.runSpawn('cd ..', null, __dirname, false));
        expect(util.runSpawn('cd ..', null, null, false));

    });

});

describe('util.removeFiles(list, callback, filters)', function(){
    it('callback test', function(done){
        util.mkdirSync(path.join(__dirname, '1/2/3/4'));
        util.removeFiles(path.join(__dirname, '1'), function(err){
            expect(err).to.be.equal(undefined);
            done();
        }, null, true);
    });

    it('remove files include itself by short argu', function(){
        util.mkdirSync(path.join(__dirname, '1/2/3/4'));
        expect(util.removeFiles(path.join(__dirname, '1'), true));
        expect(fs.existsSync(path.join(__dirname, '1'))).to.equal(false);
    });

    it('filter test', function(){
        util.mkdirSync(path.join(__dirname, '1'));
        fs.writeFileSync(path.join(__dirname, '1/1.txt'), 'hello');
        fs.writeFileSync(path.join(__dirname, '1/2.txt'), 'hello');

        expect(util.removeFiles(path.join(__dirname, '1'), /1\.txt$/));
        expect(fs.existsSync(path.join(__dirname, '1/1.txt'))).to.equal(true);
    });

    it('remove files except itself by short argu', function(){
        util.mkdirSync(path.join(__dirname, '1/2/3/4'));

        expect(util.removeFiles(path.join(__dirname, '1')));
        expect(fs.existsSync(path.join(__dirname, '1'))).to.equal(true);
    });

});


