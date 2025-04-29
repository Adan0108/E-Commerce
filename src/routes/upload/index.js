'use strict'


const express = require('express');
const UploadController = require('../../controllers/upload.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

// router.use(authenticationV2)
router.post('/product' , asyncHandler(UploadController.uploadFile));



module.exports = router