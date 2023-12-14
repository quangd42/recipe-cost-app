const express = require('express');
const db = require('../connection.js');
const bodyParser = require('body-parser');
const debug = require('debug')('app:ingredients');

ingredientsRouter = express.Router();
ingredientsRouter.use(bodyParser.json());

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

const createIngredient = async (ingredient) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');
  const res = await collection.insertOne(ingredient);
  return res;
};

ingredientsRouter
  .route('/')
  .get((req, res) => {
    res.render('ingredients', {
      title: 'Pantry',
      currentUser: {
        isAuthenticated: true,
      },
      INGREDIENT_LIST,
      SUPPORTED_UNITS,
    });
  })
  .post(async (req, res) => {
    const ingredient = req.body;
    try {
      const result = await createIngredient(ingredient);
      debug(result);
      res.send(`Ingredient ${result.insertedId} added`);
    } catch (err) {
      debug(err);
      res.status(500).send('Error adding ingredient');
    }
  });

ingredientsRouter
  .route('/:id')
  .get((req, res) => {
    debug(`Getting ${req.params}`);
    res.send(`Getting ${req.params.id}`);
  })
  .post((req, res) => {
    let ingredient = req.console.log(`Posting ${req.params}`);
  })
  .delete((req, res) => {
    res.send(`Deleting ${req.params.id}`);
  });

module.exports = {
  ingredientsRouter,
  SUPPORTED_UNITS,
  INGREDIENT_LIST,
};
