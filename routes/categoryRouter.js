const express = require('express');
const categoryController = require('../controllers/categoryController');
const isAuthenticated = require('../middlewares/isAuth');

const categoryRouter = express.Router();

//! Create category for a user
categoryRouter.post('/api/v1/categories/create',isAuthenticated,categoryController.create);

//! List all categories of a user
categoryRouter.get('/api/v1/categories/lists',isAuthenticated,categoryController.lists);

//! Update category
categoryRouter.put('/api/v1/categories/update/:id',isAuthenticated,categoryController.update);

//! delete category
categoryRouter.delete('/api/v1/categories/delete/:id',isAuthenticated,categoryController.delete);

module.exports = categoryRouter;