const express = require('express');
const { Ingredient } = require('../../models/IngredientModel.js');

const {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
} = require('../../services/ingredientServices.js');

ingredientApiRouter = express.Router();

ingredientApiRouter.use(express.json());
ingredientApiRouter.use(express.urlencoded({ extended: true }));

ingredientApiRouter
  .route('/')
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
      const ingredientData = req.body;
      await createIngredient(ingredientData);

      res.send({ message: 'Ingredient added.' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });

ingredientApiRouter
  .route('/:id')
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
      console.log(`Deleted ${result}`);
      res.send({ message: 'Ingredient deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).send('Error deleting ingredient');
    }
  });

module.exports = {
  ingredientApiRouter,
};
