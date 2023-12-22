const express = require('express');
const debug = require('debug')('app:ingredients');

const {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
} = require('../services/ingredientsServices.js');
const { SUPPORTED_UNITS } = require('../models/IngredientModel.js');

ingredientsRouter = express.Router();
ingredientsRouter.use(express.json());
ingredientsRouter.use(express.urlencoded({ extended: true }));

ingredientsRouter.route('/').get(async (req, res) => {
  try {
    const ingredients = await getIngredients();

    res.render('index', {
      title: 'Pantry',
      template: 'ingredients',
      currentUser: {
        isAuthenticated: true,
      },
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
      template: 'ingredient',
      currentUser: {
        isAuthenticated: true,
      },
      ingredient,
      SUPPORTED_UNITS,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting ingredient');
  }
});

ingredientsRouter.route('/api/').get(async (req, res) => {
  try {
    const ingredients = await getIngredients();

    res.send(ingredients);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting ingredients');
  }
});

module.exports = {
  ingredientsRouter,
};
