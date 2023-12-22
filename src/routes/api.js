const express = require('express');
const { Ingredient } = require('../models/IngredientModel.js');

const {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
} = require('../services/ingredientsServices.js');

apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.use(express.urlencoded({ extended: true }));

apiRouter
  .route('/ingredients')
  .get(async (req, res) => {
    try {
      const ingredients = await getIngredients();
      console.log(ingredients);
      res.send(JSON.stringify(ingredients));
    } catch (error) {
      console.log(err);
      res.status(500).send('Error getting ingredients');
    }
  })
  .post(async (req, res) => {
    try {
      const ingredient = new Ingredient(req.body);
      await createIngredient(ingredient);

      res.send({ message: 'Ingredient added.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Error adding ingredient' });
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
  .put(async (req, res) => {
    try {
      const ingredientId = req.params.id;
      const updates = new Ingredient(req.body);

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
  apiRouter,
};
