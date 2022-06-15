'use strict';

const fs = require(`fs`).promises;

const {getRandomInt, shuffle, customConsole} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const FILE_NAME = `fill-db.sql`;
const MAX_COUNT = 1000;
const MAX_COMMENTS = 4;

const FILE_SENTENCES_PATH = `./src/data/sentences.txt`;
const FILE_TITLES_PATH = `./src/data/titles.txt`;
const FINE_CATEGORIES_PATH = `./src/data/categories.txt`;
const FILE_COMMENTS_PAHT = `./src/data/comments.txt`;
const FILE_PICTURES_PATH = `./src/data/pictures.txt`;

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    customConsole.error(err);
    return [];
  }
};

const generateComments = (params) => {
  const {count, articleId, userCount, comments} = params;

  return (Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `)
  })));
};

const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;

const generateArticle = (data) => {
  const {
    count,
    sentencesData,
    titlesData,
    categoriesData,
    commentsData,
    userCount
  } = data;

  return Array(+count)
    .fill({})
    .map((_, index) => ({
      title: titlesData[getRandomInt(0, titlesData.length - 1)],
      сategories: shuffle(categoriesData).slice(0, 2),
      announcement: shuffle(sentencesData).slice(0, getRandomInt(0, 4)).join(``),
      comments: generateComments({
        count: getRandomInt(1, MAX_COMMENTS),
        articleId: index + 1,
        userCount,
        comments: commentsData,
      }),
      text: sentencesData[getRandomInt(0, 4)],
      userId: getRandomInt(1, userCount),
      photoFile:
      getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX))
    }));
};

const checkCountArticle = (count) => {
  if (count > MAX_COUNT) {
    customConsole(`Не больше 1000 публикаций`);
    process.exit(ExitCode.error);
  }
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentencesData = await readContent(FILE_SENTENCES_PATH);
    const titlesData = await readContent(FILE_TITLES_PATH);
    const categoriesData = await readContent(FINE_CATEGORIES_PATH);
    const commentsData = await readContent(FILE_COMMENTS_PAHT);
    const picturesData = await readContent(FILE_PICTURES_PATH);

    const [count] = args;
    checkCountArticle(count);

    const users = [
      {
        email: `gt@gmail.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        name: `Jayson Tatum`,
        avatar: `avatar1.jpg`
      },
      {
        email: `jb@gmail.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf90`,
        name: `Jaylen Brown`,
        avatar: `avatar2.jpg`
      }
    ];

    const articles = generateArticle({
      count,
      titlesData,
      categoriesData,
      commentsData,
      picturesData,
      userCount: users.length,
      sentencesData,
    });

    const comments = articles.flatMap((article) => article.comments);

    const articleCategoryes = articles.map((article, index) => ({
      articleId: index + 1,
      categoryId: index + 1
    }));

    const userValues = users.map(({email, passwordHash, name, avatar}) =>
      `('${email}', '${passwordHash}', '${name}', '${avatar}')`).join(`,\n`);

    const categoryValues = categoriesData.map((category) => `('${category}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, announcement, text, photoFile, userId}) => `('${title}', '${announcement}', '${text}', '${photoFile}', ${userId})`
    ).join(`,\n`);

    const articleCategotyValues = articleCategoryes.map(({articleId, categoryId}) =>
      `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentsValues = comments.map(({text, userId, articleId}) =>
      `('${text}', ${userId}, ${articleId})`).join(`,\n`);

    const content = `INSERT INTO categories(name) VALUES
    ${categoryValues};

    INSERT INTO users(email, password_hash, name, avatar) VALUES
    ${userValues};

    ALTER TABLE articles DISABLE TRIGGER ALL;
    INSERT INTO articles(title, announcement, text, photo_file, user_id) VALUES
    ${articleValues};

    ALTER TABLE articles ENABLE TRIGGER ALL;
    ALTER TABLE aricle_categories DISABLE TRIGGER ALL;
    INSERT INTO aricle_categories(article_id, category_id) VALUES
    ${articleCategotyValues};

    ALTER TABLE aricle_categories ENABLE TRIGGER ALL;
    ALTER TABLE comments DISABLE TRIGGER ALL;
    INSERT INTO comments(text, user_id, article_id) VALUES
    ${commentsValues};

    ALTER TABLE comments ENABLE TRIGGER ALL;
    `;

    try {
      await fs.writeFile(FILE_NAME, content);
      customConsole.info(`Operation success. File created.`);
    } catch (err) {
      customConsole.error(`Can't write data to file...`);
    }
  }
};
