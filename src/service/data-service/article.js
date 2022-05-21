'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  get articles() {
    return this._articles;
  }

  create(article) {
    const newArticle = Object.assign({id: nanoid(MAX_ID_LENGTH)}, {comments: []}, article);

    this._articles.push(newArticle);
    return newArticle;
  }

  remove(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);

    return article;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, newArticle) {
    const prevArticle = this._articles.find((item) => item.id === id);

    return Object.assign(prevArticle, newArticle);
  }
}

module.exports = ArticleService;
