/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:booksRoutesMongo');
// const books = require('./books');

module.exports = (nav) => {

  const booksRouter = express.Router();

  const getBooksCollection = async () => {

    const url = 'mongodb://localhost:27017';
    const dbName = 'libraryApp';

    const client = await MongoClient.connect(url);
    debug('Connected to mongo server');

    const db = client.db(dbName);

    const col = await db.collection('books');

    return { client, col };
  };

  const closeClient = (client) => {
    if (client) { 
      client.close(); 
    }
  };


  booksRouter.route('/')
    .get((req, res) => {

      (async function query() {
        let client;
        try {
          const v = await getBooksCollection();
          client = v.client;
          const { col } = v;
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

        closeClient(client);
      }());
    });

  booksRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;

      let client;

      (async function query() {
        try {
          const v = await getBooksCollection();
          client = v.client;
          const { col } = v;

          const book = await col.findOne({ _id: new ObjectID(id) });

          res.render('bookView',
            {
              nav,
              title: 'Library',
              book
            });
        } catch (err) {
          debug(err.stack);
          res.send('Server error');
        }

        closeClient(client);
      }());
    });

  return booksRouter;
};
