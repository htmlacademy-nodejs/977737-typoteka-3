'use strict';

const {Router} = require(`express`);

const userRouter = new Router();

userRouter.get(`/`, (req, res) => res.render(`user/user`));
userRouter.get(`/categories`, (req, res) => res.render(`user/all-categories`));
userRouter.get(`/comments`, (req, res) => res.render(`user/comments`));

module.exports = userRouter;
