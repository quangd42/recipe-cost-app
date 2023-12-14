const express = require('express');
const morgan = require('morgan');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const {
  ingredientsRouter,
  SUPPORTED_UNITS,
  INGREDIENT_LIST,
} = require('./routes/ingredients');

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

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('./public'));

// Render Home page
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    currentUser: {
      isAuthenticated: true,
    },
    INGREDIENT_LIST,
    SUPPORTED_UNITS,
  });
});

// Ingredients Route
app.use('/ingredients', ingredientsRouter);

app.post('/get-ingredient-data', (req, res) => {
  let ingredient = ingredients.find((ingredient) => {
    if (ingredient.id == req.body.ingredient_id) {
      return ingredient;
    }
  });
  res.send(ingredient);
});

module.exports = app;
