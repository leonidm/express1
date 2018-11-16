const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRoutes');
const books = require('./books');

module.exports = () => {

  const adminRouter = express.Router();

  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function query() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to mongo server');

          const db = client.db(dbName);

          const response = await db.collection('books').insertMany(books);

          res.json(response);
        } catch (err) {
          debug(err.stack);
          res.send('Server error');
        }

        client.close();
      }());
    });

  return adminRouter;
};
