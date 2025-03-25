const express = require('express');

const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/staff/login').post(authController.loginStaff);

router.route('/user/login').post(authController.loginUser);

module.exports = router;