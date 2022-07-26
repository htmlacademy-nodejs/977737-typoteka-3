'use strict';

const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async remove(id) {
    const deleteRows = await this._Article.destroy({
      where: {id}
    });
    return !!deleteRows;
  }

  findOne(id) {
    return this._Article.findByPk(id, {include: [Aliase.CATEGORIES]});
  }

  async update(id, newArticle) {
    const [affectedRows] = await this.update(newArticle, {
      where: {id}
    });

    return !!affectedRows;
  }
}

module.exports = ArticleService;
