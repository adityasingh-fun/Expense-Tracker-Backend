const express = require('express');
const transactionController = require('../controllers/transactionController');
const isAuthenticated = require('../middlewares/isAuth');

const transactionRouter = express.Router();

//! add transaction
transactionRouter.post('/api/v1/transactions/create',isAuthenticated,transactionController.create);

//! Get all transactions of a user
transactionRouter.get('/api/v1/transactions/lists',isAuthenticated,transactionController.lists);

//! Update Transaction
transactionRouter.put('/api/v1/transactions/update/:id',isAuthenticated,transactionController.update);

//! Delete Transaction
transactionRouter.delete('/api/v1/transactions/delete/:id',isAuthenticated,transactionController.delete);

module.exports = transactionRouter;