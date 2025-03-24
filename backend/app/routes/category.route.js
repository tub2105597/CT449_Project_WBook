const express = require('express');

const categoryController = require('../controllers/category.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/')
    .get(categoryController.getAllCategories)
    .post(
        // authController.protect,
        categoryController.createCategory
    );

router.route('/:id')
    .get(categoryController.getCategory)
    .patch(
        // authController.protect,
        categoryController.updateCategory
    )
    .delete(
        // authController.protect,
        categoryController.deleteCategory
    );

module.exports = router;