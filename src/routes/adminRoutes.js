/* eslint-disable prefer-destructuring */
const express = require('express');
const debug = require('debug')('app:adminRoutes');
const books = require('./books');
const mongoUtils = require('../mongo');


module.exports = () => {

  const adminRouter = express.Router();

  adminRouter.route('/')
    .get((req, res) => {

      (async function query() {
        let client;
        try {
          const mongo = await mongoUtils.getCollection('books');
          client = mongo.client;

          const response = await mongo.collection('books').insertMany(books);

          res.json(response);
        } catch (err) {
          debug(err.stack);
          res.send('Server error');
        }
        if (client) client.close();
      }());
    });

  return adminRouter;
};
