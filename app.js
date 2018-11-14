const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');


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

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.set('views', './src/views');
//  app.set('view engine', 'pug');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }
];

const booksRouter = require('./src/routes/booksRoutes')(nav);

app.use('/books', booksRouter);

app.get('/', (req, res) => {
  //  res.sendFile(path.join(__dirname, 'views', 'index.html'));
  res.render(
    'index',
    {
      nav: [
        { link: '/books', title: 'Books' },
        { link: '/authors', title: 'Authors' }],
      title: 'Library'
    }
  );
});

const port = process.env.PORT || 3000;

app.listen(port, () => debug(`listening at port ${chalk.green(port)}`));
