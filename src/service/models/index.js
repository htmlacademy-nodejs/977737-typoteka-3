'use strict';

const {Model} = require(`sequelize`);
const Aliase = require(`./aliase`);

const defineCategory = require(`./category`);
const defineArticle = require(`./article`);
const defineComment = require(`./comment`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Article = defineArticle(sequelize);
  const Comment = defineComment(sequelize);

  Article.hasMany(
      Comment,
      {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`}
  );

  Comment.belongsTo(Article, {foreignKey: `articleId`});

  ArticleCategory.init({}, {sequelize});

  Article.belongsToMany(
      Category,
      {through: ArticleCategory, as: Aliase.ARTICLES}
  );

  Category.belongsToMany(
      Article,
      {through: ArticleCategory, as: Aliase.CATEGORIES}
  );

  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Article, Comment};
};

module.exports = define;
