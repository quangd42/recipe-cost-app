const express = require('express');
const { Ingredient } = require('../../models/IngredientModel.js');

ingredientApiRouter = express.Router();

ingredientApiRouter.use(express.json());
ingredientApiRouter.use(express.urlencoded({ extended: true }));

ingredientApiRouter
  .route('/')
  .get(async (req, res) => {
    try {
      const ingredients = await Ingredient.find({ user: req.user._id }).sort({
        name: 1,
      });
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
      const existingIngre = await Ingredient.findOne({
        name: ingredientData.name,
        user: req.user._id,
      });

      if (existingIngre) {
        throw new Error('Ingredient exists.');
      }

      const ingredient = new Ingredient({
        name: ingredientData.name,
        unitSymbol: ingredientData.symbol,
        unitCost: ingredientData.unitCost,
        user: req.user._id,
      });

      await ingredient.save();

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
      const filter = {
        _id: req.params.id,
        user: req.user._id,
      };
      const ingredient = await Ingredient.findOne(filter);

      res.send(ingredient);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error getting ingredient');
    }
  })
  .put(async (req, res) => {
    try {
      const filter = {
        _id: req.params.id,
        user: req.user._id,
      };

      const ingredient = await Ingredient.findOne(filter);

      ingredient.name = req.body.name;
      ingredient.unitSymbol = req.body.symbol;
      ingredient.unitCost = req.body.unitCost;

      const result = await ingredient.save();

      res.flash('success', `${ingredient.name} updated.`);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error modifying ingredient');
    }
  })
  .delete(async (req, res) => {
    try {
      const filter = {
        _id: req.params.id,
        user: req.user._id,
      };
      const result = await Ingredient.findOneAndDelete(filter);
      res.send(result);
    } catch (err) {
      console.log(err);
      res.status(500).send('Error deleting ingredient');
    }
  });

module.exports = {
  ingredientApiRouter,
};
