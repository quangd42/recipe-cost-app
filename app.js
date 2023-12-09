const express = require('express')
const debug = require('debug')('app')
const morgan = require('morgan')
const path = require('path')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const ingredientsRouter = require('./src/routers/ingredients')

const PORT = process.env.PORT || 3000
const app = express()

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
]

const SUPPORTED_UNITS = [
    { symbol: 'each', name: 'Each' },
    { symbol: 'g', name: 'Gram' },
    { symbol: 'kg', name: 'Kilogram' },
    { symbol: 'cup', name: 'Cup' },
    { symbol: 'tbsp', name: 'Tablespoon' },
    { symbol: 'tsp', name: 'Teaspoon' },
    { symbol: 'oz', name: 'Ounces' },
]

app.use(morgan('tiny'))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, '/src/views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, '/public')))

// Render Home page
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home',
        currentUser: {
            isAuthenticated: true,
        },
        ingredients,
        SUPPORTED_UNITS,
    })
})

// Ingredients Route
app.use('/ingredients', ingredientsRouter)

app.post('/get-ingredient-data', (req, res) => {
    let ingredient = ingredients.find((ingredient) => {
        if (ingredient.id == req.body.ingredient_id) {
            return ingredient
        }
    })
    res.send(ingredient)
})

app.listen(PORT, () => {
    debug(`Listening to port ${PORT}...`)
})
