/* eslint-disable no-underscore-dangle */
const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:booksRoutesMongo');
// const books = require('./books');

module.exports = (nav) => {

  const booksRouter = express.Router();

  booksRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function query() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to mongo server');

          const db = client.db(dbName);

          const col = await db.collection('books');
          const books = await col.find().toArray();

          // ejs needs id of book so copy _id to id
          books.forEach((b) => {
            // eslint-disable-next-line no-param-reassign
            b.id = b._id;
          });

          res.render('bookListView',
            {
              nav,
              title: 'Library',
              books
            });
        } catch (err) {
          debug(err.stack);
          res.send('Server error');
        }

        client.close();
      }());
    });

  return booksRouter;
};
