'use strict';

const fs = require(`fs`).promises;
const {nanoid} = require(`nanoid`);

const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);
const {getRandomInt, shuffle, customConsole} = require(`../../utils`);

const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);
const initDataBase = require(`../lib/init-db`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COMMENTS = 4;

const FILE_SENTENCES_PATH = `./src/data/sentences.txt`;
const FILE_TITLES_PATH = `./src/data/titles.txt`;
const FINE_CATEGORIES_PATH = `./src/data/categories.txt`;
const FILE_COMMENTS_PAHT = `./src/data/comments.txt`;
const FILE_PICTURES_PATH = `./src/data/pictures.txt`;

const logger = getLogger({});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    customConsole.error(err);
    return [];
  }
};

const generateComments = (count, comments) => (Array(count).fill({}).map(() => ({
  id: nanoid(MAX_ID_LENGTH),
  text: shuffle(comments)
    .slice(0, getRandomInt(1, 3))
    .join(` `)
})));

const generateArticle = (data) => {
  const {
    count,
    sentencesData,
    titlesData,
    categoriesData,
    commentsData,
    picturesData
  } = data;

  return Array(count)
    .fill({})
    .map(() => {
      return {
        title: titlesData[getRandomInt(0, titlesData.length - 1)],
        сategories: shuffle(categoriesData).slice(0, 2),
        announcement: shuffle(sentencesData).slice(0, getRandomInt(0, 4)).join(``),
        comments: generateComments(getRandomInt(1, MAX_COMMENTS), commentsData),
        text: sentencesData[getRandomInt(0, 4)],
        photoFile:
          getRandomInt(0, 1)
            ? picturesData[getRandomInt(0, picturesData.length)]
            : null,
      };
    });
};

const checkCountArticle = (count) => {
  if (count > MAX_COUNT) {
    logger.error(`Не больше 1000 публикаций`);
    process.exit(ExitCode.error);
  }
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const sentencesData = await readContent(FILE_SENTENCES_PATH);
    const titlesData = await readContent(FILE_TITLES_PATH);
    const categoriesData = await readContent(FINE_CATEGORIES_PATH);
    const commentsData = await readContent(FILE_COMMENTS_PAHT);
    const picturesData = await readContent(FILE_PICTURES_PATH);

    const [count] = args;
    checkCountArticle(count);

    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticle({
      count: countArticle,
      sentencesData,
      titlesData,
      categoriesData,
      commentsData,
      picturesData,
    });

    return initDataBase(sequelize, {articles, categoriesData});
  }
};
