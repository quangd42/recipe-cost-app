const mongoose = require('mongoose');

const SUPPORTED_UNITS = [
  { symbol: 'each', name: 'each' },
  { symbol: 'g', name: 'gram' },
  { symbol: 'kg', name: 'kilogram' },
  { symbol: 'cup', name: 'cup' },
  { symbol: 'tbsp', name: 'tablespoon' },
  { symbol: 'tsp', name: 'teaspoon' },
  { symbol: 'oz', name: 'ounces' },
];

const supportedSymbols = SUPPORTED_UNITS.map((unit) => unit.symbol);

const getUnitName = (symbol) => {
  const unit = SUPPORTED_UNITS.find((unit) => unit.symbol == symbol);

  return unit.name;
};

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 3,
    trim: true,
    required: true,
  },

  unit: {
    symbol: {
      type: String,
      required: true,
      enum: [...supportedSymbols],
    },
    name: String,
  },

  unitCost: {
    type: Number,
    required: true,
  },
});

ingredientSchema.virtual('unitSymbol').set(function (symbol) {
  console.log('set symbol', symbol);
  this.unit.symbol = symbol;
  this.unit.name = getUnitName(symbol);
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = {
  Ingredient,
  SUPPORTED_UNITS,
};
