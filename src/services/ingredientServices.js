const { Ingredient } = require('../models/IngredientModel');

const createIngredient = async (ingredientData) => {
  const existingIngre = await Ingredient.findOne({ name: ingredientData.name });

  if (existingIngre) {
    throw new Error('Ingredient exists.');
  }

  const ingredient = new Ingredient({
    name: ingredientData.name,
    unitSymbol: ingredientData.symbol,
    unitCost: ingredientData.unitCost,
  });

  const res = await ingredient.save();

  return res;
};

const getIngredient = async (ingredientId) => {
  const res = await Ingredient.findById(ingredientId);

  return res;
};

const getIngredients = async () => {
  const res = await Ingredient.find({}).sort({ name: 1 });

  return res;
};

const updateIngredient = async (ingredientId, updateData) => {
  const updates = {
    name: updateData.name,
    unitSymbol: updateData.symbol,
    unitCost: updateData.unitCost,
  };
  const res = await Ingredient.findByIdAndUpdate(ingredientId, updates);

  return res;
};

const deleteIngredient = async (ingredientId) => {
  const res = await Ingredient.findByIdAndDelete(ingredientId);

  return res;
};

module.exports = {
  createIngredient,
  getIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
};
