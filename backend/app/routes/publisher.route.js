const express = require('express');

const publisherController = require('../controllers/publisher.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/')
    .get(
        // authController.protect,
        publisherController.getAllPublishers
    )
    .post(
        // authController.protect,
        publisherController.createPublisher
    );

router.route('/:id')
    .get(
        // authController.protect,
        publisherController.getPublisher
    )
    .patch(
        // authController.protect,
        publisherController.updatePublisher
    )
    .delete(
        // authController.protect,
        publisherController.deletePublisher
    );

module.exports = router;