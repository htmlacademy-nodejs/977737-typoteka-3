'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const {HttpCode, customConsole} = require(`../../utils`);

const DEFAULT_PORT = 3000;
const MOCK_FILE = `mocks.json`;

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(MOCK_FILE);
        const mocks = JSON.parse(fileContent);
        const title = mocks.map((article) => `<li>${article.title}</li>`).join(``);
        sendResponse({
          res,
          statusCode: HttpCode.OK,
          content: `<ul>${title}</ul>`
        });
      } catch (err) {
        sendResponse({
          res,
          statusCode: HttpCode.NOT_FOUND,
          content: notFoundMessageText
        });
      }
      break;
    default:
      sendResponse({
        res,
        statusCode: HttpCode.NOT_FOUND,
        content: notFoundMessageText,
      });
      break;
  }
};

const sendResponse = (params) => {
  const {res, statusCode, content} = params;
  const template = `
    <!Doctype html>
    <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${content}</body>
    </html>`.trim();

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template);
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        customConsole.info(`Ожидаю соединений на ${port}`);
      })
      .on(`error`, ({message}) => {
        customConsole.error(`Ошибка при создании сервера: ${message}`);
      });
  }
};

