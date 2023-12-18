const express = require('express');
const morgan = require('morgan');
const path = require('path');
const ejs = require('ejs');

// Import routes
const { indexRouter } = require('./routes/index');
const {
  ingredientsRouter,
  SUPPORTED_UNITS,
  INGREDIENT_LIST,
} = require('./routes/ingredients');
const { apiRouter } = require('./routes/api');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.path, req.body);
  next();
});

app.set('views', path.join(__dirname, 'views/layout'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// Use Routes
app.use('/', indexRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/api', apiRouter);

module.exports = app;
