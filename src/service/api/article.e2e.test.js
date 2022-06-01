'use strict';

const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);

const DataService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    id: `sIMWpv`,
    title: `Рок — это протест`,
    createdDate: `24-04-2022 06:39:29`,
    announcement: [],
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
    announcement: [],
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

const URL = `/articles`;

const createApi = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));

  app.use(express.json());

  article(app, new DataService(cloneData), new CommentService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).get(URL);
  });

  test(`Status code 200`,
      () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 2 articles`,
      () => expect(response.body.length).toBe(2));
  test(`First article's id equals "sIMWpv"`,
      () => expect(response.body[0].id).toBe(`sIMWpv`));
});

describe(`API returns an article with given id`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`${URL}/sIMWpv`);
  });

  test(`Status code 200`,
      () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`The article's title is "Рок — это протест"`,
      () => expect(response.body.title).toBe(`Рок — это протест`));
});

describe(`API create an article if data is valid`, () => {
  const newArticle = {
    title: `test title`,
    categories: [`Музыка`],
    photoFile: `file.png`,
    date: `11.11.2011`,
    announcement: [],
    text: `test text`
  };

  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`${URL}/sIMWpv`).send(newArticle);
  });

  test(`Status code 200`,
      () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`,
      () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`,
      () => request(app)
        .get(`${URL}/sIMWpv`)
        .expect((res) => expect(res.body.title).toBe(`test title`)));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = {
    title: `test title`,
    categories: [`Музыка`],
    photoFile: `file.png`,
    date: `11.11.2011`,
    announcement: [],
    text: `test text`
  };

  const app = createApi();

  test(`Without any required property response code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app).post(URL).send(badArticle).expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `test title`,
    categories: [`Музыка`],
    photoFile: `file.png`,
    date: `11.11.2011`,
    announcement: [],
    text: `test text`
  };

  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`${URL}/sIMWpv`)
      .send(newArticle);
  });

  test(`Status code 200`,
      () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns changed article`,
      () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`Article is really changed`, () => request(app)
    .get(`${URL}/sIMWpv`)
    .expect((res) => expect(res.body.title).toBe(`test title`)));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const app = createApi();

  const validArticle = {
    title: `test title`,
    categories: [`Музыка`],
    photoFile: `file.png`,
    date: `11.11.2011`,
    announcement: [],
    text: `test text`
  };

  return request(app)
    .put(`${URL}/NOEXIST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const app = createApi();

  const invalidArticle = {
    title: `test title`,
    categories: [`Музыка`],
    photoFile: `file.png`,
    announcement: [],
    text: `test text`
  };

  return request(app)
    .put(`${URL}/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an offer`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).delete(`${URL}/sIMWpv`);
  });

  test(`Status code 200`,
      () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return delete article`, () => expect(response.body.id).toBe(`sIMWpv`));

  test(`Article count is 1 now`, () => request(app)
      .get(URL)
      .expect((res) => expect(res.body.length).toBe(1)));
});

test(`API refuse to delete non-existent article`, () => {
  const app = createApi();

  return request(app)
    .delete(`${URL}/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app).get(`${URL}/sIMWpv/comments`);
  });

  test(`Status code 200`,
      () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Returns list of 4 comments`,
      () => expect(response.body.length).toBe(3));

  test(`Firs comment's id is 1Qmgi3`,
      () => expect(response.body[0].id).toBe(`1Qmgi3`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `It's the best comment`,
  };

  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`${URL}/sIMWpv/comments`)
      .send(newComment);
  });

  test(`Status code 201`,
      () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`Returns comment created`,
      () => expect(response.body).toEqual(expect.objectContaining(newComment)));

  test(`Comment count is changet`,
      () => request(app)
      .get(`${URL}/sIMWpv/comments`)
      .expect((res) => expect(res.body.length).toBe(4)));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createApi();

  return request(app)
    .post(`${URL}/NOEXST/comments`)
    .send({
      text: `text comment`,
    })
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createApi();

  return request(app)
    .post(`${URL}/sIMWpv/comments`)
    .send({})
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createApi();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`${URL}/sIMWpv/comments/1Qmgi3`);
  });

  test(`Status code 200`,
      () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`Return comment delete`,
      () => expect(response.body.id).toBe(`1Qmgi3`));

  test(`Comments count is 2 now`, () => request(app)
    .get(`${URL}/sIMWpv/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent comment`,
    () => {
      const app = createApi();

      return request(app)
        .delete(`${URL}/sIMWpv/comments/NOEXST`)
        .expect(HttpCode.NOT_FOUND);
    });

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createApi();

  return request(app)
    .delete(`${URL}/NOEXST/comments/1Qmgi3`)
    .expect(HttpCode.NOT_FOUND);
});
