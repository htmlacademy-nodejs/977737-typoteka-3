/* eslint-disable new-cap */
'use strict';

const {Model, DataTypes} = require(`sequelize`);

const MAX_LENGTH = 100;

class Comment extends Model {}

const define = (sequelize) => Comment.init({
  text: {
    type: DataTypes.STRING(MAX_LENGTH),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: `Comment`,
  tableName: `comments`,
});

module.exports = define;
