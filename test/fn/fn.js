const path = require('path');
const extFs = require('yyl-fs');
const fs = require('fs');

const FRAG_PATH = path.join(__dirname, '__frag');

const fn = {
  frag: {
    async build () {
      if (!fs.existsSync(FRAG_PATH)) {
        await extFs.mkdirSync(FRAG_PATH);
      } else {
        await extFs.removeFiles(FRAG_PATH);
      }
    },
    async destory () {
      await extFs.removeFiles(FRAG_PATH, true);
    }
  }
};

exports.fn = fn;
exports.FRAG_PATH = FRAG_PATH;