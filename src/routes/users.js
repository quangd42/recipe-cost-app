const express = require('express');
const { passport } = require('../config/passportConfig');

const { User } = require('../models/UserModel');

// User Routes
const usersRouter = express.Router();
usersRouter.use(express.json());
usersRouter.use(express.urlencoded({ extended: true }));

usersRouter
  .get('/login', async (req, res) => {
    res.render('index', {
      title: 'Login',
      template: '../users/login.ejs',
      user: req.user,
    });
  })
  .post(
    '/login',
    passport.authenticate('local', {
      failureRedirect: '/users/login',
      failureMessage: true,
      successReturnToOrRedirect: '/',
    }),
  );

usersRouter.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

usersRouter
  .route('/register')
  .get(async (req, res) => {
    res.render('index', {
      title: 'Register',
      template: '../users/register.ejs',
      user: req.user,
    });
  })
  .post(async (req, res) => {
    try {
      const userData = req.body;

      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        throw new Error('Email taken');
      }

      const user = new User(userData);
      user = await user.save();
      req.login(user, function () {
        res.redirect('/');
      });
    } catch (err) {
      if (err.message === 'Email taken') {
        res.send(JSON.stringify(err));
      } else {
        console.log(err);
        res.status(500).send('Error registering new user.');
      }
    }
  });

module.exports = {
  usersRouter,
};
