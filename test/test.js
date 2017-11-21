'use strict';
var 
    util = require('../index.js'),
    expect = require('chai').expect,
    path = require('path');

describe('util.readdirSync(iPath, filter)', function(){
    it('function test', function(){
        expect(util.readdirSync(path.join(__dirname, '../'), /node_modules/)).to.not.include('node_modules');
    });
});

describe('util.envStringify(obj)', function(){
    it('function test', function(){
        expect(util.envStringify({name: 'sub'})).to.equal('--name sub');
        expect(util.envStringify({name: true})).to.equal('--name true');
        expect(util.envStringify({name: 123})).to.equal('--name 123');
    });
});



