'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const {HttpCode, customConsole} = require(`../../utils`);

const DEFAULT_PORT = 3000;
const MOCK_FILE = `mocks.json`;

const app = express();
app.use(express.json());
app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(MOCK_FILE);
    const mockData = JSON.parse(fileContent) || [];
    res.json(mockData);
  } catch (_err) {
    res.json([]);
  }
});

app.use((req, res) => res.status(HttpCode.NOT_FOUND).send(`Not found`));

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return customConsole.error(`Ошибка при создании сервера`, err);
      }

      return customConsole.info(`Ожидаю соединений на ${port}`);
    });
  }
};

