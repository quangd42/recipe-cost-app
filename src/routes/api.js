const express = require('express');
const db = require('../connection.js');
const { ObjectId } = require('mongodb');

apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));

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

apiRouter.route('/ingredients').get(async (req, res) => {
  try {
    const ingredients = await getIngredients();
    console.log(ingredients);
    res.send(JSON.stringify(ingredients));
  } catch (error) {
    console.log(err);
    res.status(500).send('Error getting ingredients');
  }
});

apiRouter
  .route('/ingredients/:id')
  .get(async (req, res) => {
    try {
      const ingredientId = req.params.id;
      const ingredient = await getIngredient(ingredientId);

      res.send(ingredient);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error getting ingredient');
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await deleteIngredient(req.params.id);
      console.log(result);

      if (result.deletedCount === 1) {
        console.log('Successfully deleted one document.');
        res.status(200).send(result);
      } else {
        console.log('No documents matched the query. Deleted 0 documents.');
        res
          .status(500)
          .error('No documents matched the query. Deleted 0 documents.');
      }
    } catch (err) {
      console.log(err);
      res.status(500).send('Error deleting ingredient');
    }
  });

module.exports = {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
  apiRouter,
};
