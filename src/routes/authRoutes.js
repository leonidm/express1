const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');


module.exports = () => {

  const authRouter = express.Router();

  authRouter.route('/signUp')
    .post((req, res) => {

      debug(req.body); // body is added to req object by body-parser package

      // create user
      req.login(req.body, () => { // login is added as we call app.use(passport.initialize()); login will use passport strategy
        res.redirect('/auth/profile');
      });

      // res.json(req.body);
    });

  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user); // user field is added to req object after user logged in (that passport does)
    });

  return authRouter;
};
