/* eslint-disable new-cap */
'use strict';

const {DataTypes, Model} = require(`sequelize`);

const MaxLength = {
  TEXT: 1000,
  ANNOUNCEMENT: 1000,
};

class Article extends Model {}

const define = (sequelize) => Article.init({
  photoFile: DataTypes.STRING,
  announcement: {
    type: DataTypes.STRING(MaxLength.ANNOUNCEMENT),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: null,
  },
  text: DataTypes.STRING(MaxLength.TEXT),
}, {
  sequelize,
  modelName: `Article`,
  tableName: `articles`,
});

module.exports = define;
