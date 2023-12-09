const express = require('express')

ingredientsRouter = express.Router()

const ingredient_list = [
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

ingredientsRouter.route('/').get((req, res) => {
    res.render('ingredients', {
        title: 'Pantry',
        currentUser: {
            isAuthenticated: true,
        },
        ingredient_list,
        SUPPORTED_UNITS,
    })
})

ingredientsRouter
    .route('/:id')
    .get((req, res) => {
        console.log(`Getting ${req.params}`)
        res.send(`Getting ${req.params.id}`)
    })
    .post((req, res) => {
        console.log(`Posting ${req.params}`)
    })
    .delete((req, res) => {
        res.send(`Deleting ${req.params.id}`)
    })

module.exports = ingredientsRouter
