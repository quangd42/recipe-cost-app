const express = require('express');

const { Ingredient, SUPPORTED_UNITS } = require('../models/IngredientModel.js');

const indexRouter = express.Router();
indexRouter.use(express.json());
indexRouter.use(express.urlencoded({ extended: true }));

// Render Home page
indexRouter.get('/', async (req, res) => {
  const ingredients = await Ingredient.find({}).sort({ name: 1 });
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
