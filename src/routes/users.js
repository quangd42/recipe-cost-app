const express = require('express');

const { createUser, getUser } = require('../services/userServices');

const usersRouter = express.Router();
usersRouter.use(express.json());
usersRouter.use(express.urlencoded({ extended: true }));

usersRouter.get('/login', async (req, res) => {
  res.render('index', {
    title: 'Login',
    template: '../users/login.ejs',
    currentUser: {
      isAuthenticated: false,
    },
  });
});

usersRouter
  .route('/register')
  .get(async (req, res) => {
    res.render('index', {
      title: 'Register',
      template: '../users/register.ejs',
      currentUser: {
        isAuthenticated: false,
      },
    });
  })
  .post(async (req, res) => {
    try {
      const result = await createUser(req.body);
      res.send(result);
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
