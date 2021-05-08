const path = require('path')
module.exports = {
  // collectCoverage: true, // 收集测试时的覆盖率信息
  // coverageDirectory: path.resolve(__dirname, './coverage'), // 指定输出覆盖信息文件的目录
  // 指定收集覆盖率的目录文件，只收集每个包的lib目录，不收集打包后的dist目录
  collectCoverageFrom: ['**/lib/**', '!**/dist/**'],
  testURL: 'https://www.shuidichou.com/jd', // 设置jsdom环境的URL
  testMatch: [
    // 测试文件匹配规则
    '**/__tests__/**/*.test.js'
  ],
  // 忽略测试路径
  testPathIgnorePatterns: ['/node_modules/'],
  // 配置测试最低阈值
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
