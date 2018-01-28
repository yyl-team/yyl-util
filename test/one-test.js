'use strict';
const chalk = require('chalk');
const util = require('../lib/yyl-util.js');
util.cleanScreen();

const COLOR_REG = /(\u001b\[\d+m|\033\[[0-9;]+m)/g;

const fn = {
  getStrSize: (str) => {
    return str.replace(COLOR_REG, '').length;
  },

  subStr: (str, begin, len) => {
    const dos = [];
    str.replace(COLOR_REG, (str) => {
      dos.push(str);
    });
    const strArr = str.split(COLOR_REG);
    const size = fn.getStrSize(str);
    for (let i = 0; i < strArr.length;) {
      if (strArr[i].match(COLOR_REG)) {
        strArr.splice(i, 1);
      } else {
        i++;
      }
    }

    if (begin > size - 1) {
      return '';
    }

    if (len === undefined) {
      len = size - 1 - begin;
    } else if (begin + len > size - 1) {
      len = size - 1 - begin;
    }

    let r = '';
    let point = 0;
    let isBegin = false;
    let isEnd = false;
    strArr.forEach((iStr, i) => {
      if (isEnd) {
        return;
      }
      const strLen = iStr.length;

      if (!isBegin) {
        if (begin >= point && begin < point + strLen) {
          r = iStr.substr(begin - point);
          if (i % 2 != 0) {
            r = `${dos[i - 1]}${r}`;
          }
          isBegin = true;
        }
      } else {
        if (begin + len >= point && begin + len <= point + strLen) { // is end
          r = `${r}${dos[i - 1]}${iStr.substr(0, begin + len - point)}`;
          if (i % 2 != 0 && i < dos.length) {
            r = `${r}${dos[i]}`;
          }

          isEnd = true;
          return true;
        } else { // add it
          r = `${r}${dos[i - 1]}${iStr}`;
        }
      }

      point += strLen;
    });
    return r;
  }
};

const str = `${chalk.red('012')}${chalk.blue('345')}${chalk.white('67')}${chalk.black('89')}`;

console.log(str, str.length);
console.log('fn.getStrSize', fn.getStrSize(str));
console.log('fn.subStr', fn.subStr(str, 3, 3), fn.subStr(str, 3, 3) == chalk.blue('345'));
console.log('fn.subStr', fn.subStr(str, 0, 3), fn.subStr(str, 0, 3) == chalk.red('012'));
console.log('fn.subStr', fn.subStr(str, 6, 2), fn.subStr(str, 6, 2) == chalk.white('67'));
console.log('fn.subStr', fn.subStr(str, 3, 5), fn.subStr(str, 3, 5) == `${chalk.blue('345')}${chalk.white('67')}`);
