const express = require('express');
const books = require('./books');

const booksRouter = express.Router();

booksRouter.route('/')
  .get((req, res) => {
    res.render('bookListView',
      {
        nav: [
          { link: '/books', title: 'Books' },
          { link: '/authors', title: 'Authors' }],
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
          nav: [
            { link: '/books', title: 'Books' },
            { link: '/authors', title: 'Authors' }],
          title: 'Library',
          book: books[id]
        });
    }
  });

module.exports = booksRouter;
