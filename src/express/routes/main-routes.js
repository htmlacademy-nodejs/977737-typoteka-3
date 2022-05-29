'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

const api = require(`../api`).getAPI();

// mainRouter.get(`/`, (req, res) => res.render(`main`));
mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});
mainRouter.get(`/register`, (req, res) => res.render(`register`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, (req, res) => res.render(`search`));

module.exports = mainRouter;
