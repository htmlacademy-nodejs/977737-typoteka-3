'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`title`, `photoFile`, `date`, `category`, `announcement`, `text`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const isKeysExists = articleKeys.every((key) => keys.includes(key));

  if (!isKeysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  return next();
};
