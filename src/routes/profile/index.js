'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { profiles, profile } = require('../../controllers/profile.controller');
const { grantAccess } = require('../../middlewares/rbac');

//admin
router.get('/viewAny', grantAccess('readAny', 'profile'),profiles)

//shop
router.get('/viewOwn', grantAccess('readOwn','profile'), profile)

module.exports = router