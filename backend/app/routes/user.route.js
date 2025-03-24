const express = require('express');

const userController = require('../controllers/user.controller');

const router = express.Router();

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);
router.route('/me').get(userController.getMe).patch(userController.updateMe).delete(userController.deleteMe);

module.exports = router;