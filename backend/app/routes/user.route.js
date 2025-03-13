const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.route('/me').get(userController.getMe).patch(userController.updateMe).delete(userController.deleteMe);

module.exports = router;