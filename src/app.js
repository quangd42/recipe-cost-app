const express = require('express');
const morgan = require('morgan');
const path = require('path');
const debug = require('debug')('app');

const ejs = require('ejs');
const flash = require('express-flash-message').default;

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { connect } = require('./config/dbConfig');

// Import routes
const { indexRouter } = require('./routes/index');
const { ingredientsRouter } = require('./routes/ingredients');
const { apiRouter } = require('./routes/api');
const { usersRouter } = require('./routes/users');
const passport = require('passport');

const app = express();

// Middlewares
app.use(express.json());

app.use(morgan('tiny'));
app.use((req, res, next) => {
  debug('Received request:', req.method, req.path, req.body);
  next();
});

// Set up session
const sess = {
  secret: 'very secret recipe',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: MongoStore.create({
    client: connect().then((m) => m.connection.getClient()),
  }),
};
if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}
app.use(session(sess));

// Passport use session
app.use(passport.session());

// Set up flash
app.use(flash({ sessionKeyName: 'express-flash-message' }));

app.set('views', path.join(__dirname, 'views/layout'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use('/static/flowbite', express.static('node_modules/flowbite/dist'));

// Use Routes
app.use('/', indexRouter);
app.use('/ingredients', ingredientsRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

module.exports = app;
