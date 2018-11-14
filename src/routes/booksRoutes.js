const express = require('express');
const sql = require('mssql');
// const debug = require('debug')('app:bookRoutes');
// const books = require('./books');

module.exports = (nav) => {

  const booksRouter = express.Router();

  booksRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');
        // debug(recordset);
        res.render('bookListView',
          {
            nav,
            title: 'Library',
            books: recordset
          });
      }());
    });

  booksRouter.route('/:id')
    // this is midleware - executed for every HTTP request for this route(get, post, put, etc...)
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();

        const { recordset } = await request
          .input('id', sql.Int, id)
          .query('select * from books where id = @id');
        
        [req.book] = recordset;
        next();
      }());
    })
    .get((req, res) => {
      res.render('bookView',
        {
          nav,
          title: 'Library',
          book: req.book
        });
    });

  return booksRouter;
};
