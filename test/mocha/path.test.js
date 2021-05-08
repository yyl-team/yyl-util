const util = require('../../lib/yyl-util');
const expect = require('chai').expect;

describe('util.path.join() test', () => {
  it('web url test', () => {
    expect(util.path.join('http://www.testhost.com/991')).to.equal('http://www.testhost.com/991');
    expect(util.path.join('https://www.testhost.com/991')).to.equal('https://www.testhost.com/991');
    expect(util.path.join('//www.testhost.com/991')).to.equal('//www.testhost.com/991');
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
    expect(util.path.resolve('./../test/', './../test2/1.md')).to.equal(util.path.join(__dirname, '../../../test2/1.md'));
    expect(util.path.resolve('.\\..\\test\\', '.\\..\\test2\\1.md')).to.equal(util.path.join(__dirname, '../../../test2/1.md'));
    expect(util.path.resolve('//www.testhost.com', 'pc/html/helloworld.html')).to.equal('//www.testhost.com/pc/html/helloworld.html');
  });
});