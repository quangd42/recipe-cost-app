const express = require('express');
const db = require('../connection.js');
const debug = require('debug')('app:ingredients');
const { ObjectId } = require('mongodb');

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

const createIngredient = async (ingredient) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const res = await collection.insertOne(ingredient);

  return res;
};

const getIngredient = async (ingredientId) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const objectId = new ObjectId(ingredientId);
  const res = await collection.findOne({ _id: objectId });

  return res;
};

const getIngredients = async () => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const options = {
    sort: { name: 1 },
    projection: { _id: 1, name: 1, unit: 1, unitCost: 1 },
  };
  const res = await collection.find({}, options).toArray();

  return res;
};

const updateIngredient = async (ingredientId, updates) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const objectId = new ObjectId(ingredientId);
  const filter = { _id: objectId };
  const updateDoc = {
    $set: updates,
  };

  const res = await collection.updateOne(filter, updateDoc);

  return res;
};

const deleteIngredient = async (ingredientId) => {
  const client = await db.connect();
  const collection = client.db(db.dbName).collection('ingredients');

  const objectId = new ObjectId(ingredientId);
  const filter = { _id: objectId };

  const res = await collection.deleteOne(filter);

  return res;
};

ingredientsRouter
  .route('/')
  .get(async (req, res) => {
    try {
      const ingredients = await getIngredients();
      // const ingredients = INGREDIENT_LIST;

      res.render('ingredients', {
        title: 'Pantry',
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
  })
  .post(async (req, res) => {
    const ingredient = req.body;
    try {
      const result = await createIngredient(ingredient);
      res.send({ message: `Ingredient ${result.insertedId} added` });
      // res.send({ message: `${ingredient}` });
    } catch (err) {
      console.log(err);
      res.status(500).send('Error adding ingredient');
    }
  });

ingredientsRouter
  .route('/:id')
  .get(async (req, res) => {
    try {
      const ingredientId = req.params.id;
      const ingredient = await getIngredient(ingredientId);

      res.render('ingredient', {
        title: `Edit ${ingredient.name}`,
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
  })
  .delete(async (req, res) => {
    try {
      console.log(req.params.id);
      // TODO: find out how to query by ObjectId
      const result = await deleteIngredient(req.params.id);
      console.log(result);
      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
      } else {
        console.log('No documents matched the query. Deleted 0 documents.');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Error deleting ingredient');
    }
  });

module.exports = {
  ingredientsRouter,
  SUPPORTED_UNITS,
  INGREDIENT_LIST,
};
