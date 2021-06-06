/**
 * 版本对比
 * @param ver1 版本 01
 * @param ver2 版本 02
 * @return v1 > v2 返回 1
 */
export function compareVersion(v1: string, v2: string) {
  if (v1 === '*' && v2) {
    return -1
  } else if (v1 && v2 === '*') {
    return 1
  } else if (v1 === v2) {
    return 0
  }

  const semver = /^[v^~]?(?:0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(\.(?:[x*]|0|[1-9]\d*)(?:-[\da-z-]+(?:\.[\da-z-]+)*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?)?)?$/i
  const patch = /-([0-9A-Za-z-.]+)/

  function split(v: string) {
    const temp = v.replace(/^(v|\^|~)/, '').split('.')
    const arr = temp.splice(0, 2)
    arr.push(temp.join('.'))
    return arr
  }

  function tryParse(v: string) {
    return isNaN(Number(v)) ? v : Number(v)
  }

  function validate(version: string) {
    if (typeof version !== 'string') {
      throw new TypeError('Invalid argument expected string')
    }
    if (!semver.test(version)) {
      throw new Error('Invalid argument not valid semver')
    }
  }

  ;[v1, v2].forEach(validate)

  const s1 = split(v1)
  const s2 = split(v2)

  for (let i = 0; i < 3; i++) {
    const n1 = parseInt(`${s1[i] || 0}`, 10)
    const n2 = parseInt(`${s2[i] || 0}`, 10)

    if (n1 > n2) {
      return 1
    }
    if (n2 > n1) {
      return -1
    }
  }

  if ([s1[2], s2[2]].every(patch.test.bind(patch))) {
    const e1 = patch.exec(s1[2])
    const e2 = patch.exec(s2[2])
    const p1 = `${e1 ? e1[1] : ''}`.split('.').map(tryParse)
    const p2 = `${e2 ? e2[1] : ''}`.split('.').map(tryParse)

    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      if (p1[i] === undefined || (typeof p2[i] === 'string' && typeof p1[i] === 'number')) {
        return -1
      }
      if (p2[i] === undefined || (typeof p1[i] === 'string' && typeof p2[i] === 'number')) {
        return 1
      }

      if (p1[i] > p2[i]) {
        return 1
      }
      if (p2[i] > p1[i]) {
        return -1
      }
    }
  } else if ([s1[2], s2[2]].some(patch.test.bind(patch))) {
    return patch.test(s1[2]) ? -1 : 1
  }

  return 0
}

/**
 * version 匹配
 * @param ver1 版本 01
 * @param ver2 版本 02
 */
export function matchVersion(ver1: string, ver: string) {
  const githubReg = /^github:\w+/
  if (ver1.match(githubReg) || ver.match(githubReg)) {
    return false
  }
  const r = compareVersion(ver1, ver)
  const aVer = `${ver1}`
  const bVer = `${ver}`
  const oriVer = aVer.replace(/^[~^v]/, '')
  // *
  if (aVer === '*') {
    return true
    // ^1.0.0
  } else if (/^\^/.test(aVer)) {
    if (r <= 0 && oriVer.split('.')[0] === bVer.split('.')[0]) {
      return true
    } else {
      return false
    }
    // ~1.0.0
  } else if (/^~/.test(aVer)) {
    return r === 0
    // 1.0.0
  } else if (/^\d/.test(aVer)) {
    return r === 0
  } else {
    return aVer === bVer
  }
}
