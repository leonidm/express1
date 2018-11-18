const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:authRoutes');


module.exports = () => {

  const authRouter = express.Router();

  authRouter.route('/signUp')
    .post((req, res) => {

      const { username, password } = req.body;
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function query() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to mongo server');
          const db = client.db(dbName);
          const col = await db.collection('users');
          const user = { username, password };
          const results = await col.insertOne(user);
          // debug(results);

          // create user
          const createdUser = results.ops[0];
          req.login(createdUser, () => { // login is added as we call app.use(passport.initialize());
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err.stack);
          res.send('Server error');
        }
        if (client) {
          client.close();
        }
      }());

      // debug(req.body); // body is added to req object by body-parser package


      // res.json(req.body);
    });

  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user); // user field is added to req object after user logged in (that passport does)
    });

  return authRouter;
};
