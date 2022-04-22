'use strict';

const packageJsonVersion = require(`../../../package.json`).version;
const chalk = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    console.info(chalk.blue(packageJsonVersion));
  },
};
