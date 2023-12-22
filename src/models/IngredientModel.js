const Joi = require('joi');

const SUPPORTED_UNITS = [
  { symbol: 'each', name: 'each' },
  { symbol: 'g', name: 'gram' },
  { symbol: 'kg', name: 'kilogram' },
  { symbol: 'cup', name: 'cup' },
  { symbol: 'tbsp', name: 'tablespoon' },
  { symbol: 'tsp', name: 'teaspoon' },
  { symbol: 'oz', name: 'ounces' },
];

const supportedSymbols = SUPPORTED_UNITS.map((unit) => {
  return unit.symbol;
});

const ingredientDataSchema = Joi.object({
  name: Joi.string().trim().min(3).required(),
  symbol: Joi.string()
    .lowercase()
    .valid(...supportedSymbols)
    .required(),
  unitCost: Joi.number().min(0).required(),
});

// console.log(
//   ingredientDataSchema.validate({ name: 'Flour', unitCost: 3, symbol: 'Each' }),
// );

class Ingredient {
  constructor(ingredientData) {
    const result = ingredientDataSchema.validate(ingredientData);
    if (result.error) {
      throw new Error('Invalid Ingredient Data.');
    }

    this.name = ingredientData.name;
    this.setUnit = ingredientData.symbol;
    this.unitCost = ingredientData.unitCost;
  }

  set setUnit(symbol) {
    const unit = SUPPORTED_UNITS.find((unit) => unit.symbol === symbol);
    this.unit = unit;
  }

  static getUnitName(symbol) {
    const supportedUnit = SUPPORTED_UNITS.find(
      (unit) => unit.symbol === symbol,
    );
    return supportedUnit.name;
  }

  convertTo(unit) {
    // Add conversion logic here
  }
}

module.exports = {
  Ingredient,
  SUPPORTED_UNITS,
};
