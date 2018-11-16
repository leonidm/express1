const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');


module.exports = () => {

  const authRouter = express.Router();

  authRouter.route('/signUp')
    .post((req, res) => {
      debug(req.body); // body is added by body-parser package

      res.json(req.body);
    });

  return authRouter;
};
