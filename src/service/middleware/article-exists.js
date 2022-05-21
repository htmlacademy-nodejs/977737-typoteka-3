'use strict';

const {HttpCode, RESPONSE_TEXT} = require(`../../constants`);

module.exports = (service) => (req, res, next) => {
  const {articleId} = req.params;
  const article = service.findOne(articleId);

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).send(`${RESPONSE_TEXT} with ${articleId}`);
  }

  res.locals.article = article;
  return next();
};
