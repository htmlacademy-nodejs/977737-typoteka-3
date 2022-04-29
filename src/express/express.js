'use strict';

const express = require(`express`);
const articlesRoutes = require(`./routes/articles-routes`);
const userRoutes = require(`./routes/user-routes`);
const mainRoutes = require(`./routes/main-routes`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/articles`, articlesRoutes);
app.use(`/user`, userRoutes);
app.use(`/`, mainRoutes);

app.listen(DEFAULT_PORT);
