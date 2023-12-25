const express = require('express');

const { getIngredients } = require('../services/ingredientServices.js');
const { SUPPORTED_UNITS } = require('../models/IngredientModel.js');

const indexRouter = express.Router();
indexRouter.use(express.json());
indexRouter.use(express.urlencoded({ extended: true }));

// Render Home page
indexRouter.get('/', async (req, res) => {
  const ingredients = await getIngredients();
  res.render('index', {
    title: 'Home',
    template: '../index',
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
