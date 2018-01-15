'use strict';
var chalk = require('chalk');
var util = require('../lib/yyl-util.js');

util.runCMD('cls');


console.log(chalk.black.bgYellow(' JS   ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
console.log(chalk.white.bgMagenta(' IMG  ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
console.log(chalk.black.bgCyan(' CSS  ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
console.log(chalk.white.bgBlue(' HTML ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
console.log(chalk.white.bgRed(' REV  ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
console.log(chalk.black.bgGreen(' DONE '), chalk.green('Finished in 10123 ms'));



