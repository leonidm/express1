/* eslint-disable prefer-destructuring */
const passport = require('passport');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:local.strategy');
const mongoUtils = require('../../mongo');


module.exports = () => {
  passport.use(new Strategy(
    {
      usernameField: 'username', // fields from sign-up form
      passwordField: 'password'
    },
    (username, password, done) => {
      
      (async function query() {
        let client;
        try {
          const mongo = await mongoUtils.getCollection('users');
          client = mongo.client;

          const user = await mongo.collection.findOne({ username });
          
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
