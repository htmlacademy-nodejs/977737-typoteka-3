'use strict';

const Sequelize = require(`sequelize`);

const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const isNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some(((db) => db === undefined));

if (isNotDefined) {
  console.log([DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT]);
  throw new Error(`One or more environmental variables are not defined`);
}

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: `postgres`,
  poll: {
    max: 5,
    min: 0,
    acquire: 1000,
    idle: 1000
  }
});

