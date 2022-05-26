'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `sIMWpv`,
    title: `Рок — это протест`,
    createdDate: `24-04-2022 06:39:29`,
    announce: [],
    сategory: [
      `IT`,
      `Без рамки`,
      `Кино`,
      `Музыка`,
      `За жизнь`,
      `Программирование`,
      `Разное`,
      `Железо`,
    ],
    text: `Мне кажется или я уже читал это где-то?, Совсем немного...,`,
    comments: [
      {id: `1Qmgi3`, text: `Плюсую, но слишком много буквы!,`},
      {
        id: `3vIlZ-`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,`,
      },
      {
        id: `4Jt0xe`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете., Плюсую, но слишком много буквы!,`,
      },
    ],
  },
  {
    id: `_gjz2N`,
    title: `Ёлки. История деревьев`,
    createdDate: `09-04-2022 06:39:29`,
    announce: [],
    сategory: [
      `Без рамки`,
      `Музыка`,
      `Деревья`,
      `Программирование`,
      `IT`,
      `Кино`,
      `Железо`,
      `За жизнь`,
    ],
    text: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это небольшом гаджете.`,
    comments: [
      {id: `w3CZof`, text: `Согласен с автором!, Это где ж такие красоты?,`},
      {id: `sDvVwl`, text: `Планируете записать видосик на эту тему?`},
      {
        id: `XNs475`,
        text: `Хочу такую же футболку :-), Мне кажется или я уже читал это где-то?,`,
      },
      {
        id: `ig_wpH`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.,`,
      },
    ],
  },
];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

const categoryNames = [`IT`, `Без рамки`, `Кино`, `Музыка`, `За жизнь`, `Программирование`, `Разное`, `Железо`];

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 9 categories`, () => expect(response.body.length).toBe(9));
  test(`Category names are categoryNames`,
      () => expect(response.body).toEqual(expect.arrayContaining(categoryNames)));
});
