const { shortEnvStringify } = require('../')

describe('shortEnvStringify(obj)', () => {
  it('string test', () => {
    expect(
      shortEnvStringify({
        name: 'sub'
      })
    ).toEqual('-name sub')
  })

  it('boolean test', () => {
    expect(
      shortEnvStringify({
        name: true
      })
    ).toEqual('-name')

    expect(
      shortEnvStringify({
        name: 'true'
      })
    ).toEqual('-name')

    expect(
      shortEnvStringify({
        name: false
      })
    ).toEqual('-name false')

    expect(
      shortEnvStringify({
        name: 'false'
      })
    ).toEqual('-name false')
  })

  it('number test', () => {
    expect(
      shortEnvStringify({
        name: 123
      })
    ).toEqual('-name 123')
  })

  it('muti test', () => {
    expect(
      shortEnvStringify({
        name: 'hello',
        num: 1,
        real: true
      })
    ).toEqual('-name hello -num 1 -real')
  })
})
