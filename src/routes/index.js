const express = require('express');

const { getIngredients } = require('../config/ingredientServices.js');
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
    user: req.user,
    ingredients,
    SUPPORTED_UNITS,
  });
});

module.exports = {
  indexRouter,
};
