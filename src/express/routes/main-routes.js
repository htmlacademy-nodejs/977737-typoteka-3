'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([api.getArticles(), api.getCategories()]);
  res.render(`main`, {articles, categories});
});
mainRouter.get(`/register`, (req, res) => res.render(`register`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const result = await api.search(query);

    res.render(`search`, {result});
  } catch (err) {
    res.render(`search`, {
      result: [],
    });
  }
});

module.exports = mainRouter;
