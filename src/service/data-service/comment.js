'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  create(article, comment) {
    const newComment = Object.assign({id: nanoid(MAX_ID_LENGTH)}, comment);

    article.comment.push(newComment);
    return newComment;
  }

  remove(article, id) {
    const removedComment = article.comments.find((comment) => comment.id === id);

    if (!removedComment) {
      return null;
    }

    article.comments.filter((comment) => comment.id !== id);

    return removedComment;
  }

  findAll(article) {
    return article.comments;
  }
}

module.exports = CommentService;
