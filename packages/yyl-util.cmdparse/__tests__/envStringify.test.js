const { envStringify } = require('../')
const { expect } = require('chai')

describe('envStringify(obj)', () => {
  it('string test', () => {
    expect(
      envStringify({
        name: 'sub'
      })
    ).toEqual('--name sub')
  })

  it('boolean test', () => {
    expect(
      envStringify({
        name: true
      })
    ).toEqual('--name')

    expect(
      envStringify({
        name: 'true'
      })
    ).toEqual('--name')

    expect(
      envStringify({
        name: false
      })
    ).toEqual('--name false')

    expect(
      envStringify({
        name: 'false'
      })
    ).toEqual('--name false')
  })

  it('number test', () => {
    expect(
      envStringify({
        name: 123
      })
    ).toEqual('--name 123')
  })

  it('muti test', () => {
    expect(
      envStringify({
        name: 'hello',
        num: 1,
        real: true
      })
    ).toEqual('--name hello --num 1 --real')
  })
})
