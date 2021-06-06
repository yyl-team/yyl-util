const { pathFormat } = require('../')
const path = require('path')

describe('pathFormat.join() test', () => {
  it('web url test', () => {
    expect(pathFormat.join('http://www.testhost.com/991')).toEqual('http://www.testhost.com/991')
    expect(pathFormat.join('https://www.testhost.com/991')).toEqual('https://www.testhost.com/991')
    expect(pathFormat.join('//www.testhost.com/991')).toEqual('//www.testhost.com/991')
  })
  it('file path test', () => {
    expect(pathFormat.join('./../test/test.js')).toEqual('../test/test.js')
    expect(pathFormat.join('.\\..\\test\\test.js')).toEqual('../test/test.js')
  })
})

describe('pathFormat.relative() test', () => {
  it('file path test', () => {
    expect(pathFormat.relative('./../test/', './../test2/1.md')).toEqual('../test2/1.md')
    expect(pathFormat.relative('.\\..\\test\\', '.\\..\\test2\\1.md')).toEqual('../test2/1.md')
  })
})

describe('pathFormat.resolve() test', () => {
  it('file path test', () => {
    console.log(__dirname)
    expect(pathFormat.resolve(__dirname, './../test2/1.md')).toEqual(
      pathFormat.join(__dirname, '../test2/1.md')
    )
    expect(pathFormat.resolve(__dirname.split(path.sep).join('\\'), '.\\..\\test2\\1.md')).toEqual(
      pathFormat.join(__dirname, '../test2/1.md')
    )
    expect(pathFormat.resolve('//www.testhost.com', 'pc/html/helloworld.html')).toEqual(
      '//www.testhost.com/pc/html/helloworld.html'
    )
  })
})
