const { type } = require('../')
describe('type()', () => {
  it('type array test', () => {
    expect(type([])).toEqual('array')
  })

  it('type object test', () => {
    expect(type({})).toEqual('object')
  })

  it('type function test', () => {
    expect(type(() => {})).toEqual('function')
  })

  it('type number test', () => {
    expect(type(1)).toEqual('number')
  })

  it('type undefined test', () => {
    expect(type(undefined)).toEqual('undefined')
  })

  it('type null test', () => {
    expect(type(null)).toEqual('null')
  })
})
