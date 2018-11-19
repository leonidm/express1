/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const { ObjectID } = require('mongodb');
const debug = require('debug')('app:booksRoutesMongo');
const mongoUtils = require('../mongo');
// const books = require('./books');

module.exports = (nav) => {

  const booksRouter = express.Router();

  const closeClient = (client) => {
    if (client) {
      client.close();
    }
  };

  booksRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });

  booksRouter.route('/')
    .get((req, res) => {

      (async function query() {
        let client;
        try {
          const mongo = await mongoUtils.getCollection('books');
          client = mongo.client;
          const books = await mongo.collection.find().toArray();

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
          const mongo = await mongoUtils.getCollection('books');
          client = mongo.client;

          const book = await mongo.collection.findOne({ _id: new ObjectID(id) });

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
