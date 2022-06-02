'use strict';

const {Router} = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);
const {ensureArray} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img/`;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const api = require(`../api`).getAPI();
const articlesRoutes = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

articlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles/articles-by-category`));

articlesRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`articles/post`, {categories});
});

articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [categories, article] = await Promise.all([api.getCategories(), api.getArticle(id)]);
  res.render(`articles/post`, {categories, article});
});

articlesRoutes.get(`/:id`, (req, res) => res.render(`articles/post-detail`));

articlesRoutes.post(`/add`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;

  const articleData = {
    photoFile: file ? file.filename : ``,
    title: body.title,
    announcement: body.announcement,
    text: body.text,
    categories: ensureArray(body.categories),
    date: body.date,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
});

module.exports = articlesRoutes;

