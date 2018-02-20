'use strict';
const util = require('../lib/yyl-util.js');
util.cleanScreen();

util.runCMD('yyl', () => {
  console.log('done');
}, __dirname, true, true);
