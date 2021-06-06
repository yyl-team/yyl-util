const { envParse } = require('../')

describe('envParse(argv)', () => {
  it('function test', () => {
    expect(envParse('--name sub')).toEqual({
      name: 'sub'
    })
    expect(envParse('--name true')).toEqual({
      name: true
    })
    expect(envParse('--name 123')).toEqual({
      name: 123
    })

    expect(envParse(['--name', 'sub'])).toEqual({
      name: 'sub'
    })
    expect(envParse(['--name', 'true'])).toEqual({
      name: true
    })
    expect(envParse(['--name', 'false'])).toEqual({
      name: false
    })
    expect(envParse(['--name', '123'])).toEqual({
      name: 123
    })
  })
})
