const express = require('express');
const debug = require('debug')('app');
const books = require('./books');

const booksRouter = express.Router();

// eslint-disable-next-line no-var
let nav = 1;

booksRouter.route('/')
  .get((req, res) => {
    res.render('bookListView',
      {
        nav,
        title: 'Library',
        books
      });
  });

booksRouter.route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    if (id < 0 || id > books.length) {
      res.send('No such a book');
    } else {
      res.render('bookView',
        {
          nav,
          title: 'Library',
          book: books[id]
        });
    }
  });

module.exports = (n) => {
  nav = n;
  return booksRouter;
};
