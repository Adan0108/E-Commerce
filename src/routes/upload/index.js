'use strict'


const express = require('express');
const UploadController = require('../../controllers/upload.controller');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const { uploadDisk } = require('../../configs/multer.config');

// router.use(authenticationV2)
router.post('/product' , asyncHandler(UploadController.uploadFile));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(UploadController.uploadFileThumb));
router.post('/product/mutiple', uploadDisk.array('files', 3), asyncHandler(UploadController.uploadImageFromLocalFiles));


module.exports = router