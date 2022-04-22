"use strict";

const moment = require(`moment`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;

const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffle} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const FILE_SENTENCES_PATH = `./src/data/sentences.txt`;
const FILE_TITLES_PATH = `./src/data/titles.txt`;
const FINE_CATEGORIES_PATH = `./src/data/categories.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateArticle = (data) => {
  const {count, sentencesData, titlesData, categoriesData} = data;
  return Array(count)
    .fill({})
    .map(() => ({
      title: titlesData[getRandomInt(0, titlesData.length - 1)],
      createdDate: moment()
        .add(-getRandomInt(1, 90), `day`)
        .format(`DD-MM-YYYY hh:mm:ss`),
      announce: shuffle(sentencesData).slice(0, getRandomInt(0, 4)),
      сategory: shuffle(categoriesData).slice(0, categoriesData.length - 1),
    }));
};

const checkCountArticle = (count) => {
  if (count > MAX_COUNT) {
    console.error(chalk.red(`Не больше 1000 публикаций`));
    process.exit(ExitCode.error);
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentencesData = await readContent(FILE_SENTENCES_PATH);
    const titlesData = await readContent(FILE_TITLES_PATH);
    const categoriesData = await readContent(FINE_CATEGORIES_PATH);

    const [count] = args;
    checkCountArticle(count);
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticle({countOffer, sentencesData, titlesData, categoriesData})
    );
    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  },
};
