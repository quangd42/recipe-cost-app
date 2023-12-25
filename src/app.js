const express = require('express');
const morgan = require('morgan');
const path = require('path');
const ejs = require('ejs');
const debug = require('debug')('app');

// Import routes
const { indexRouter } = require('./routes/index');
const { ingredientsRouter } = require('./routes/ingredients');
const { apiRouter } = require('./routes/api');

const app = express();
app.use(express.json());

app.use(morgan('tiny'));
app.use((req, res, next) => {
  debug('Received request:', req.method, req.path, req.body);
  next();
});

app.set('views', path.join(__dirname, 'views/layout'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use('/static/flowbite', express.static('node_modules/flowbite/dist'));

// Use Routes
app.use('/', indexRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/api', apiRouter);

module.exports = app;
