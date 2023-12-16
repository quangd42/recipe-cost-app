const express = require('express');
const morgan = require('morgan');
const path = require('path');
const ejs = require('ejs');

const {
  ingredientsRouter,
  SUPPORTED_UNITS,
  INGREDIENT_LIST,
} = require('./routes/ingredients');
const { getIngredients, apiRouter } = require('./routes/api');

const app = express();

const ingredients = [
  {
    id: 1,
    ingredient_name: 'Egg',
    ingredient_unit: 'each',
    unit_cost: 5,
  },
  {
    id: 2,
    ingredient_name: 'Salt',
    ingredient_unit: 'kg',
    unit_cost: 12,
  },
];

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.path, req.body);
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// Render Home page
app.get('/', async (req, res) => {
  const ingredients = await getIngredients();
  res.render('index', {
    title: 'Home',
    currentUser: {
      isAuthenticated: true,
    },
    ingredients,
    SUPPORTED_UNITS,
  });
});

// Ingredients Route
app.use('/ingredients', ingredientsRouter);
app.use('/api', apiRouter);

app.post('/get-ingredient-data', (req, res) => {
  let ingredient = ingredients.find((ingredient) => {
    if (ingredient.id == req.body.ingredient_id) {
      return ingredient;
    }
  });
  res.send(ingredient);
});

module.exports = app;
