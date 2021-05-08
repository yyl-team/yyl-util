import fs from 'fs'
import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import external from 'rollup-plugin-node-externals'
import json from '@rollup/plugin-json'

function buildBanner({ type, pkg }) {
  return [
    '/*!',
    ` * ${pkg.name} ${type} ${pkg.version}`,
    ` * (c) 2020 - ${new Date().getFullYear()} ${pkg.anchor || ''}`,
    ' * Released under the MIT License.',
    ' */'
  ].join('\n')
}

function makeConfig () {
  const pkgPath = path.join(__dirname, './packages')
  const pkgNames = fs.readdirSync(pkgPath).filter((name) => !/^\./.test(name))
  let buildPkgArr = []
  Object.keys(process.env).forEach((key) => {
    if (pkgNames.includes(key)) {
      buildPkgArr.push(key)
    }
  })

  let contexts = []
  if (!buildPkgArr.length) {
    /** 加入根目录构建 */
    contexts.push(__dirname)
    buildPkgArr = pkgNames
  }

  contexts = contexts.concat(buildPkgArr.map(iPath => path.join(pkgPath, iPath)))

  return contexts
    .filter((context) => fs.existsSync(path.join(context, 'package.json')))
    .map((context) => ({
      input: path.join(context, './src/index.ts'),
      output: [{
        file: path.join(context, './output/index.js'),
        format: 'cjs',
        banner: buildBanner({ type: 'cjs', pkg: require(path.join(context, 'package.json'))}),
        exports: 'named',
        sourcemap: false
      }],
      plugins: [
        external({
          deps: true
        }),
        nodeResolve({ jsnext: true }),
        commonjs(),
        json(),
        typescript({
          typescript: require('typescript'),
          tsconfigOverride: {
            compilerOptions: {
              declarationDir: path.join(context, './output')
            },
            include: ['typing/**/*', 'src/**.*'].map((iPath) => path.join(context, iPath))
          }
        })
      ],
      external: []
    }))
}

export default makeConfig()
