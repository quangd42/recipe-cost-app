const express = require('express');
const debug = require('debug')('app:ingredients');

const {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
} = require('../config/ingredientServices.js');
const { Ingredient, SUPPORTED_UNITS } = require('../models/IngredientModel.js');

const ingredientsRouter = express.Router();
ingredientsRouter.use(express.json());
ingredientsRouter.use(express.urlencoded({ extended: true }));

ingredientsRouter.route('/').get(async (req, res) => {
  try {
    const ingredients = await Ingredient.find({}).sort({ name: 1 });
    console.log(ingredients);

    res.render('index', {
      title: 'Pantry',
      template: '../ingredients/index.ejs',
      user: req.user,
      ingredients,
      SUPPORTED_UNITS,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting ingredients');
  }
});

ingredientsRouter.route('/:id').get(async (req, res) => {
  try {
    const ingredientId = req.params.id;
    const ingredient = await getIngredient(ingredientId);

    res.render('index', {
      title: `Edit ${ingredient.name}`,
      template: '../ingredients/single.ejs',
      user: req.user,
      ingredient,
      SUPPORTED_UNITS,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting ingredient');
  }
});

module.exports = {
  ingredientsRouter,
};
