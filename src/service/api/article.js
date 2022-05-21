'use strict';

const {Router} = require(`express`);
const {HttpCode, RESPONSE_TEXT} = require(`../../constants`);
const articleValidator = require(`../middleware/article-validator`);
const articleExist = require(`../middleware/article-exists`);
const commentValidator = require(`../middleware/comment-validator`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    res.status(HttpCode.OK).json(articleService.articles);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`${RESPONSE_TEXT.NOT_FOUND} with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.remove(articleId);

    if (article) {
      return res.status(HttpCode.NOT_FOUND).send(`${RESPONSE_TEXT.NOT_FOUND} with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.body;
    const deleteComment = commentService.remove(article, commentId);

    if (!deleteComment) {
      return res.status(HttpCode.NOT_FOUND).send(RESPONSE_TEXT.NOT_FOUND);
    }

    return res.status(HttpCode.OK).json(deleteComment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
