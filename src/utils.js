'use strict';

const chalk = require(`chalk`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.ensureArray = (value) => Array.isArray(value) ? value : [value];

module.exports.prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

module.exports.customConsole = {
  info: (content) => {
    console.info(chalk.green(content));
  },
  error: (content) => {
    console.error(chalk.red(content));
  },
  log: (content) => {
    console.log(chalk.gray(content));
  },
};
