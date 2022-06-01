'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const userRouter = new Router();

userRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`user/user`, {articles});
});

userRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`user/all-categories`, {categories});
});

userRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`user/comments`, {article: articles[0]});
});

module.exports = userRouter;
