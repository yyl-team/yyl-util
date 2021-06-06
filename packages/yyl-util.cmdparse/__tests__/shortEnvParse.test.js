const { shortEnvParse } = require('../')

describe('shortEnvParse(argv)', () => {
  it('function test', () => {
    expect(shortEnvParse('-name sub')).toEqual({
      name: 'sub'
    })
    expect(shortEnvParse('-name true')).toEqual({
      name: true
    })
    expect(shortEnvParse('-name 123')).toEqual({
      name: 123
    })

    expect(shortEnvParse(['-name', 'sub'])).toEqual({
      name: 'sub'
    })
    expect(shortEnvParse(['-name', 'true'])).toEqual({
      name: true
    })
    expect(shortEnvParse(['-name', 'false'])).toEqual({
      name: false
    })
    expect(shortEnvParse(['-name', '123'])).toEqual({
      name: 123
    })
  })
})
