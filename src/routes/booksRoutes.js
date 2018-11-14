const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');
// const books = require('./books');

module.exports = (nav) => {

  const booksRouter = express.Router();
  let books = [];

  booksRouter.route('/')
    .get((req, res) => {

      const request = new sql.Request();
      request.query('select * from books')
        .then((result) => {
          // debug(result);
          books = result.recordset;
          res.render('bookListView',
            {
              nav,
              title: 'Library',
              books
            });
        });
    });

  booksRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      if (id < 0 || id > books.length) {
        res.send('No such a book');
      } else {
        const book = books.find(b => b.id === +id);
        res.render('bookView',
          {
            nav,
            title: 'Library',
            book
          });
      }
    });

  return booksRouter;
};
