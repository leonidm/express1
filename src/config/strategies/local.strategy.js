const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:local.strategy');

module.exports = () => {
  passport.use(new Strategy(
    {
      usernameField: 'username', // fields from sign-up form
      passwordField: 'password'
    },
    (username, password, done) => {
      
      const url = 'mongodb://localhost:27017';
      const dbName = 'libraryApp';

      (async function query() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected to mongo server');
          const db = client.db(dbName);
          const col = await db.collection('users');

          const user = await col.findOne({ username });
          if (user.password === password) {
            done(null, user);
          } else {
            done(null, false);
          }
        } catch (err) {
          debug(err.stack);
          done(err, false);
        }
        if (client) {
          client.close();
        }
      }());
    }
  ));
};
