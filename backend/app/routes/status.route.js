const express = require('express');

const statusController = require('../controllers/status.controller');

const router = express.Router();

router.route('/')
    .get(statusController.getAllStatuses)
    .post(statusController.createStatus);

router.route('/:id')
    .get(statusController.getStatus)
    .patch(statusController.updateStatus)
    .delete(statusController.deleteStatus);

module.exports = router;