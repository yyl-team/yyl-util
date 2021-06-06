const { compareVersion } = require('../')

describe('compareVersion(v1, v2)', () => {
  it('normal compare', () => {
    expect(compareVersion('2.0.1', '2.0.0')).toEqual(1)
    expect(compareVersion('2.1.0', '2.0.0')).toEqual(1)
    expect(compareVersion('2.1.0', '2.1.0')).toEqual(0)
    expect(compareVersion('2.1.0', '2.0.1')).toEqual(1)
    expect(compareVersion('1.1.0', '2.0.0')).toEqual(-1)
  })
  it('^1.0.0, ~1.0.0, v1.0.0 version compare', () => {
    expect(compareVersion('^2.0.1', '2.0.0')).toEqual(1)
    expect(compareVersion('~2.1.0', '2.0.0')).toEqual(1)
    expect(compareVersion('v2.1.0', '2.0.1')).toEqual(1)
    expect(compareVersion('^1.1.0', '~2.0.0')).toEqual(-1)

    expect(compareVersion('~2.1.0', '2.1.0')).toEqual(0)
    expect(compareVersion('^2.1.0', '2.1.0')).toEqual(0)
    expect(compareVersion('v2.1.0', '2.1.0')).toEqual(0)
    expect(compareVersion(1, 1)).toEqual(0)
  })
})
