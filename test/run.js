const util = require('../lib/yyl-util');

console.log(util.cmdParse('aa nightwatch -v false ./src/a.js'.split(' '), { env: { v: Boolean}}));

