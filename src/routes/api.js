const express = require('express');

const apiRouter = express.Router();

const { ingredientApiRouter } = require('./api/ingredientApi');

apiRouter.use('/ingredients', ingredientApiRouter);

module.exports = {
  apiRouter,
};
