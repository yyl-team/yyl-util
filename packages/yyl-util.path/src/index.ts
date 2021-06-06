import path from 'path'
const fn = {
  formatUrl: (url: string) => url.replace(/\\/g, '/')
}

function handleResult(r: string, iArgv: string[]) {
  // what?
  if (/^\.[\\/]$/.test(iArgv[0])) {
    r = `./${r}`
  }

  if (!/[/\\]$/.test(iArgv[iArgv.length - 1])) {
    r = r.replace(/[/\\]$/, '')
  }

  return (
    r
      .replace(/\\/g, '/')
      // 修复 mac 下 //web.yystaitc.com 会 被 path.join 变成 /web.yystaitc.com  问题
      .replace(/^(\/+)/g, /^\/\//.test(iArgv[0]) ? '//' : '$1')
      .replace(/([^/])\/+/g, '$1/')
      .replace(/(^http[s]?:)[/]+/g, '$1//')
      .replace(/(^file:)[/]+/g, '$1///')
  )
}

/** 格式化 path */
export const pathFormat = {
  join(...args: string[]) {
    let iArgv = args
    iArgv = iArgv.map((url) => {
      return fn.formatUrl(url)
    })

    const r = path.join(...iArgv)
    return handleResult(r, iArgv)
  },
  relative(...args: string[]) {
    let iArgv = args
    iArgv = iArgv.map((url) => {
      return fn.formatUrl(url)
    })
    const r = path.relative(iArgv[0], iArgv[1])
    return handleResult(r, iArgv)
  },
  resolve(...args: string[]) {
    let iArgv = args
    iArgv = iArgv.map((url) => {
      return fn.formatUrl(url)
    })

    const r = path.resolve(...iArgv)
    return handleResult(r, iArgv)
  }
}
