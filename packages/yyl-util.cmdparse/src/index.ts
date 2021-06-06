const REG = {
  NODE_HANDLE: /(node\.exe|node)$/
}

/** 任意 object 类型 */
export interface AnyObj {
  [key: string]: any
}

export interface CmdTypeDefined {
  [key: string]: BooleanConstructor | StringConstructor | NumberConstructor
}

export interface CmdParseDefineMap {
  env?: CmdTypeDefined
  shortEnv?: CmdTypeDefined
}

export interface CmdParseResult {
  cmds: string[]
  env: {
    [key: string]: boolean | number | string
  }
  shortEnv: {
    [key: string]: boolean | number | string
  }
}

/**
 * cmd 解析
 * @param processArgv process.env
 * @param typeMap 类型校验 map
 */
export function cmdParse(processArgv: string[], typeMap?: CmdParseDefineMap) {
  let iArgv = []
  if (processArgv[0].match(REG.NODE_HANDLE)) {
    iArgv = processArgv.slice(2)
  } else {
    iArgv = processArgv.slice(1)
  }
  const SHORT_ENV_REG = /^-(\w+)/
  const ENV_REG = /^--(\w+)/
  const r: CmdParseResult = {
    cmds: [],
    env: {},
    shortEnv: {}
  }

  if (!typeMap) {
    typeMap = {}
  }

  for (let i = 0, key = '', nextKey = '', len = iArgv.length; i < iArgv.length; i++) {
    key = iArgv[i]
    nextKey = iArgv[i + 1]
    if (key.match(SHORT_ENV_REG) || key.match(ENV_REG)) {
      // shortEnv | env
      let realKey: string
      let handle: keyof CmdParseDefineMap
      if (key.match(SHORT_ENV_REG)) {
        handle = 'shortEnv'
        realKey = key.replace(SHORT_ENV_REG, '$1')
      } else {
        handle = 'env'
        realKey = key.replace(ENV_REG, '$1')
      }

      const iType = typeMap[handle]
      const iVal = iType ? iType[realKey] : undefined

      let val: boolean | number | string
      if (i >= len - 1 || nextKey.match(SHORT_ENV_REG) || nextKey.match(ENV_REG)) {
        val = true
      } else if (iType && iVal) {
        // boolean 类型
        switch (iVal) {
          case Boolean:
            if (nextKey === 'true') {
              val = true
              i++
            } else if (nextKey === 'false') {
              val = false
              i++
            } else {
              val = true
            }
            break
          case Number:
            if (!isNaN(+nextKey)) {
              val = Number(nextKey)
              i++
            } else {
              val = 1
            }
            break
          case String:
          default:
            val = nextKey
            i++
            break
        }
      } else {
        if (nextKey === 'true') {
          val = true
        } else if (nextKey === 'false') {
          val = false
        } else if (!isNaN(+nextKey)) {
          val = Number(nextKey)
        } else {
          val = nextKey
        }
        i++
      }
      r[handle][realKey] = val
    } else {
      // ctx
      r.cmds.push(key)
    }
  }

  return r
}

/**
 * 缩写的 cmd 解析 如 -p 1 => { p: 1 }
 * @param argv process.env
 */
export function shortEnvParse(argv: string | string[]) {
  let iArgv: string[]
  if (typeof argv === 'string') {
    iArgv = argv.split(/\s+/)
  } else {
    iArgv = Array.from(argv)
  }
  iArgv = [''].concat(iArgv)
  const { shortEnv } = cmdParse(iArgv)
  return shortEnv
}

/**
 * object 转 cmd 缩写形式 { p: 1 } => -p 1
 * @param obj 变量集合
 */
export function shortEnvStringify(obj: AnyObj) {
  const r: string[] = []
  if (typeof obj !== 'object') {
    throw new Error(`util.envStringify error, obj type error: ${typeof obj}`)
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key] === true || obj[key] === 'true') {
      r.push(`-${key}`)
    } else {
      r.push(`-${key} ${obj[key]}`)
    }
  })
  return r.join(' ')
}

/**
 * object 转义 {path: 1} => --path 1
 * @param obj 对象
 */
export function envStringify(obj: AnyObj) {
  const r: string[] = []
  if (typeof obj !== 'object') {
    throw new Error(`util.envStringify error, obj type error: ${typeof obj}`)
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key] === true || obj[key] === 'true') {
      r.push(`--${key}`)
    } else {
      r.push(`--${key} ${obj[key]}`)
    }
  })
  return r.join(' ')
}

/**
 * cmd 解析 --path 1 => {path: 1}
 * @param env process.env
 */
export function envParse(argv: string | string[]) {
  let iArgv
  if (typeof argv === 'string') {
    iArgv = argv.split(/\s+/)
  } else {
    iArgv = Array.from(argv)
  }
  iArgv = [''].concat(iArgv)

  const { env } = cmdParse(iArgv)
  return env
}
