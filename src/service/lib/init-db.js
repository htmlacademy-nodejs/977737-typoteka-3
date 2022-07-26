'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categoriesData, articles}) => {
  const {Category, Article} = defineModels(sequelize);

  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categoriesData.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, item) => ({
    [item.name]: item.id,
    ...acc
  }), {});

  const articlePromises = articles.map(async (article) => {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});

    console.log(articleModel, '_______________')

    await articleModel.addCategories(
        article.categories.map(
            (name) => categoryIdByName[name]
        )
    );
  });

  await Promise.all(articlePromises);
};
