const express = require('express');

const apiRouter = express.Router();

const { ingredientApiRouter } = require('./api/ingredientApi');
const { userApiRouter } = require('./api/userApi');

apiRouter.use('/ingredients', ingredientApiRouter);
apiRouter.use('/users', userApiRouter);

module.exports = {
  apiRouter,
};
