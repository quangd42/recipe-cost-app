const express = require('express');
const db = require('../connection.js');
const debug = require('debug')('app:ingredients');

const {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
} = require('./api.js');

ingredientsRouter = express.Router();
ingredientsRouter.use(express.json());
ingredientsRouter.use(express.urlencoded({ extended: true }));

// TODO: Create Ingredient class
// TODO: Create validation for unit and unitCost
// class Ingredient {
//   constructor(name, unit, symbol, unitCost) {
//     this.name = name,
//     this.unit = unit,
//     this.symbol = symbol,
//     this.unitCost = unitCost,
//   }
// }

const INGREDIENT_LIST = [
  {
    id: 1,
    name: 'Egg',
    unit: 'each',
    unitCost: 5,
  },
  {
    id: 2,
    name: 'Salt',
    unit: 'kg',
    unitCost: 12,
  },
];
const SUPPORTED_UNITS = [
  { symbol: 'each', name: 'Each' },
  { symbol: 'g', name: 'Gram' },
  { symbol: 'kg', name: 'Kilogram' },
  { symbol: 'cup', name: 'Cup' },
  { symbol: 'tbsp', name: 'Tablespoon' },
  { symbol: 'tsp', name: 'Teaspoon' },
  { symbol: 'oz', name: 'Ounces' },
];

ingredientsRouter.route('/').get(async (req, res) => {
  try {
    const ingredients = await getIngredients();
    // const ingredients = INGREDIENT_LIST;

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
// .post(async (req, res) => {
//   const ingredient = req.body;
//   try {
//     const result = await createIngredient(ingredient);

//     res.redirect(`/ingredients/`);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Error adding ingredient');
//   }
// })

ingredientsRouter
  .route('/:id')
  .get(async (req, res) => {
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
  })
  .post(async (req, res) => {
    try {
      const ingredientId = req.params.id;
      const updates = req.body;

      // console.log(`Received updates: ${JSON.stringify(req.body)}`);
      const result = await updateIngredient(ingredientId, updates);
      console.log(result);

      if (result.modifiedCount === 1) {
        console.log(`Successfully modified one ingredient.`);
      } else {
        console.log(`No ingredient modified`);
      }

      res.send({ message: `Ingredient updated.` });
    } catch (err) {
      console.log(err);
      res.status(500).send('Error modifying ingredient');
    }
  });

ingredientsRouter.route('/api/').get(async (req, res) => {
  try {
    const ingredients = await getIngredients();
    // const ingredients = INGREDIENT_LIST;

    res.send(ingredients);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error getting ingredients');
  }
});

module.exports = {
  ingredientsRouter,
  SUPPORTED_UNITS,
  INGREDIENT_LIST,
};
