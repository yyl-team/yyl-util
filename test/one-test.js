'use strict';
const util = require('../lib/yyl-util.js');
util.cleanScreen();

util.infoBar.print('done', {
  foot: util.getTime(),
  barLeft: [
    '123',
    '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890',
    '1\n2\n3\n'
  ],
  barRight: 'hehe'
});
