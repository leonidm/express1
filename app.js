const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');


const app = express();

const booksRouter = express.Router();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.set('views', './src/views');
//  app.set('view engine', 'pug');
app.set('view engine', 'ejs');

booksRouter.route('/')
  .get((req, res) => {
    res.send('hello books');
  });

booksRouter.route('/single')
  .get((req, res) => {
    res.send('hello single book');
  });

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
