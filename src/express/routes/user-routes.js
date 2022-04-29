'use strict';

const {Router} = require(`express`);

const userRouter = new Router();

userRouter.get(`/`, (req, res) => res.send(`/user`));
userRouter.get(`/categories`, (req, res) => res.send(`/user/categories`));
userRouter.get(`/comments`, (req, res) => res.send(`/user/comments`));

module.exports = userRouter;
