'use strict';
const chalk = require('chalk');
const util = require('../lib/yyl-util.js');
util.cleanScreen();

console.log(util.substr(chalk.red('1234567890123456789'), 0, 15) == chalk.red('123456789012345'));

// util.infoBar.print('done', {
//   barLeft: '11111111111111111111111111111111111111111111111111111111111111111111',
//   barRight: '2222222222222222222222222222222222222222222222222222222222222222222',
//   foot: util.getTime()
// });
