/* eslint-disable global-require */
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');


debug(`Process id is ${chalk.yellow(process.pid)}`);

const app = express();

const config = {
  user: 'leonid',
  password: 'Kuku1111',
  server: 'leo-server1.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'PSLibrary',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

sql.connect(config).catch(err => debug(err));

// *************** Middleware example ************************
// app.use((req, res, next) => {
//   debug(chalk.magenta('my middleware'));
//   next();
// });********************************************************

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/mongo/books', title: 'Books 2' },
  { link: '/authors', title: 'Authors' }
];

/* eslint-disable no-use-before-define */
setUses();
setViews();
setRoutes();

app.get('/', (req, res) => {
  //  res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render(
    'index',
    {
      nav,
      title: 'Library'
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`listening at port ${chalk.green(port)}`));

// //////////////////////////////////////////////////////////////////////////

function setUses() {
  app.use(morgan('tiny'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(session({ secret: 'library' }));

  require('./src/config/passport.js')(app);

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
  app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
  app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
}

function setViews() {
  app.set('views', './src/views');
  //  app.set('view engine', 'pug');
  app.set('view engine', 'ejs');
}

function setRoutes() {
  const booksRouter = require('./src/routes/booksRoutes')(nav);
  const booksRouterMongo = require('./src/routes/booksRoutesMongo')(nav);
  const adminRouter = require('./src/routes/adminRoutes')(nav);
  const authRouter = require('./src/routes/authRoutes')();

  app.use('/books', booksRouter);
  app.use('/mongo/books', booksRouterMongo);
  app.use('/admin', adminRouter);
  app.use('/auth', authRouter);
}
