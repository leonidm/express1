const passport = require('passport');
const { Strategy } = require('passport-local');

module.exports = () => {
  passport.use(new Strategy(
    {
      usernameField: 'username', // fields from sign-up form
      passwordField: 'password'
    },
    (username, password, done) => {
      const user = {
        username,
        password
      };
      console.log('3333333333333333333333333');
      done(null, user); // done is callback - first argument is error and second data
    }
  ));
};
