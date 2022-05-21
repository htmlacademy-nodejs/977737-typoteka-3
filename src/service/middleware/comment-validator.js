'use strict';

const {HttpCode, RESPONSE_TEXT} = require(`../../constants`);

const commentKey = `text`;

module.exports = (req, res, next) => {
  const comment = req.body;
  const isKeysExists = Object.keys(comment).includes(commentKey);

  if (!isKeysExists) {
    return res.status(HttpCode.BAD_REQUEST).send(RESPONSE_TEXT.BAD_REQ);
  }

  return next();
};
