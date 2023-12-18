const express = require('express');
const db = require('../connection.js');
const debug = require('debug')('app:index');

const { getIngredients, apiRouter } = require('./api.js');

const { SUPPORTED_UNITS } = require('./ingredients.js');

indexRouter = express.Router();
indexRouter.use(express.json());
indexRouter.use(express.urlencoded({ extended: true }));

// Render Home page
indexRouter.get('/', async (req, res) => {
  const ingredients = await getIngredients();
  res.render('index', {
    title: 'Home',
    template: 'index',
    currentUser: {
      isAuthenticated: true,
    },
    ingredients,
    SUPPORTED_UNITS,
  });
});

module.exports = {
  indexRouter,
};
