const express = require('express');

const { multipleUpload } = require('../utils/upload.util');

const imageController = require('../controllers/image.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.route('/upload').post(
    multipleUpload,
    imageController.createImage
);
module.exports = router;