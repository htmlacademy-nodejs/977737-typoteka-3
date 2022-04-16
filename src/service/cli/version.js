'use strict';

const packageJsonVersion = require(`../../../package.json`).version;

module.exports = {
  name: `--version`,
  run() {
    console.info(packageJsonVersion);
  },
};
