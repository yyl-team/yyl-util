const { matchVersion } = require('../')

describe('matchVersion(v1, v2)', () => {
  it('usage check', () => {
    expect(matchVersion('^2.0.1', '2.0.0')).toEqual(false)
    expect(matchVersion('^2.0.1', '2.1.0')).toEqual(true)
    expect(matchVersion('^2.0.1', '3.0.0')).toEqual(false)

    expect(matchVersion('~2.0.1', '2.0.0')).toEqual(false)
    expect(matchVersion('~2.0.1', '2.0.1')).toEqual(true)
    expect(matchVersion('~2.0.1', '3.0.0')).toEqual(false)

    expect(matchVersion('2.0.1', '2.0.1')).toEqual(true)
    expect(matchVersion('2.0.1', '2.0.2')).toEqual(false)

    expect(matchVersion('v2.1.0', 'v2.1.0')).toEqual(true)
    expect(matchVersion('v2.1.0', 'v2.1.0')).toEqual(true)
    expect(matchVersion('1.1.1', 'github:tj/react-click-outside')).toEqual(false)
  })
})
