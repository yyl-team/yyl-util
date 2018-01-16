'use strict';
var chalk = require('chalk');
var util = require('../lib/yyl-util.js');

util.cleanScreen();
util.infoBar.init({
    keyword: {
        'A': 'magenta',
        'M': 'blue',
        'D': 'red',
        'type:number': 'gray'
    },
    foot: {
        color: 'black',
        bgColor: 'white'
    },
    head: {
        'js': {
            name: 'JS',
            color: 'black',
            bgColor: 'yellow'
        },
        'img': {
            name: 'IMG',
            color: 'white',
            bgColor: 'magenta'
        },
        'css': {
            name: 'CSS',
            color: 'black',
            bgColor: 'blue'
        },
        'html': {
            name: 'HTML',
            color: 'white',
            bgColor: 'blue'
        },
        'rev': {
            name: 'REV',
            color: 'white',
            bgColor: 'red'
        },
        'done': {
            name: 'DONE',
            color: 'black',
            bgColor: 'green'
        }
    }
});

var name = 'jack';
util.infoBar.js({barLeft: '123', barRight: '456', foot: '10s'});
console.log(`hello ${name}`);
console.log('Terminal size: ' + process.stdout.columns + 'x' + process.stdout.rows);
util.runNodeModule('yyl', {
  cwd: __dirname
});


// console.log(chalk.black.bgYellow(' JS   ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), '20', chalk.blue('M'), 10, chalk.red('D'), 0);
// console.log(chalk.white.bgMagenta(' IMG  ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
// console.log(chalk.black.bgCyan(' CSS  ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
// console.log(chalk.white.bgBlue(' HTML ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
// console.log(chalk.white.bgRed(' REV  ') + chalk.black.bgWhite(' 10s '), chalk.magenta('A'), ':', '20', chalk.blue('M'), ':', 10, chalk.red('D'), ':', 0);
// console.log(chalk.black.bgGreen(' DONE '), chalk.green('Finished in 10123 ms'));



