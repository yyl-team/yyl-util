const { cmdParse } = require('../output')

describe('cmdParse(processArgv)', () => {
  const testArr = [
    {
      input: 'npm i yyl -g --verbose'.split(' '),
      output: {
        cmds: ['npm', 'i', 'yyl'],
        shortEnv: {
          g: true
        },
        env: {
          verbose: true
        }
      }
    },
    {
      input: 'nightwatch ./src/a.js ./test --verbose'.split(' '),
      output: {
        cmds: ['nightwatch', './src/a.js', './test'],
        env: {
          verbose: true
        },
        shortEnv: {}
      }
    },
    {
      input: 'nightwatch --verbose ./src/a.js'.split(' '),
      typeMap: {
        env: {
          verbose: Boolean
        }
      },
      output: {
        cmds: ['nightwatch', './src/a.js'],
        env: {
          verbose: true
        },
        shortEnv: {}
      }
    },
    {
      input: 'nightwatch --verbose false ./src/a.js'.split(' '),
      typeMap: {
        env: {
          verbose: Boolean
        }
      },
      output: {
        cmds: ['nightwatch', './src/a.js'],
        env: {
          verbose: false
        },
        shortEnv: {}
      }
    },
    {
      input: 'nightwatch --verbose 0 ./src/a.js'.split(' '),
      typeMap: {
        env: {
          verbose: Boolean
        }
      },
      output: {
        cmds: ['nightwatch', '0', './src/a.js'],
        env: {
          verbose: true
        },
        shortEnv: {}
      }
    },
    {
      input: 'nightwatch -v false ./src/a.js'.split(' '),
      typeMap: {
        shortEnv: {
          v: Boolean
        }
      },
      output: {
        cmds: ['nightwatch', './src/a.js'],
        env: {},
        shortEnv: {
          v: false
        }
      }
    },
    {
      input: 'nightwatch -v false./src/a.js'.split(' '),
      typeMap: {
        shortEnv: {
          v: Boolean
        }
      },
      output: {
        cmds: ['nightwatch', 'false./src/a.js'],
        env: {},
        shortEnv: {
          v: true
        }
      }
    },
    {
      input: 'nightwatch --verbose ./src/a.js'.split(' '),
      typeMap: {
        env: {
          verbose: Number
        }
      },
      output: {
        cmds: ['nightwatch', './src/a.js'],
        env: {
          verbose: 1
        },
        shortEnv: {}
      }
    },
    {
      input: 'nightwatch --verbose 12 ./src/a.js'.split(' '),
      typeMap: {
        env: {
          verbose: Number
        }
      },
      output: {
        cmds: ['nightwatch', './src/a.js'],
        env: {
          verbose: 12
        },
        shortEnv: {}
      }
    },
    {
      input: 'nightwatch -v 12./src/a.js'.split(' '),
      typeMap: {
        shortEnv: {
          v: Number
        }
      },
      output: {
        cmds: ['nightwatch', '12./src/a.js'],
        env: {},
        shortEnv: {
          v: 1
        }
      }
    }
  ]

  testArr.forEach((item) => {
    it(`util.cmdParse(${item.input.join(' ')}, ${
      item.typeMap ? JSON.stringify(item.typeMap) : ''
    })`, () => {
      expect(cmdParse([''].concat(item.input), item.typeMap)).toEqual(item.output)
    })
  })

  // 特殊情况
  it('special case', () => {
    expect(
      cmdParse(
        [
          'C:\\Program Files\\nodejs\\node.exe',
          'F:\\github\\yyl-concat-webpack-plugin\\test\\commander.js',
          'watch',
          '--path',
          './test/case/base/'
        ],
        undefined
      )
    ).toEqual({
      cmds: ['watch'],
      env: {
        path: './test/case/base/'
      },
      shortEnv: {}
    })
  })
})
