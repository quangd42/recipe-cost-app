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
      envName: process.env.ENV_NAME,
      user: req.user,
    });
  })
  .post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info, status) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.flash('error', 'Incorrect Username or Password.');
        return res.redirect(req.get('referer'));
      }
      req.login(user, function () {
        res.flash('success', 'Logged in successfully!');
        res.redirect('/');
      });
    })(req, res, next);
  });

usersRouter.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.flash('info', 'Logged out!');
    res.redirect('/users/login');
  });
});

usersRouter
  .route('/register')
  .get(async (req, res) => {
    res.render('index', {
      title: 'Register',
      template: '../users/register.ejs',
      envName: process.env.ENV_NAME,
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

      const user = await new User(userData).save();
      req.login(user, function () {
        res.flash('success', 'User registered!');
        res.redirect('/');
      });
    } catch (err) {
      if (err.message === 'Email taken') {
        res.flash('error', err.message);
        res.redirect(req.get('referer'));
      } else {
        console.log(err);
        res.flash('error', err.message);
        res.redirect(req.get('referer'));
      }
    }
  });

module.exports = {
  usersRouter,
};
