'use strict'

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const {
  newResouce,
  newRole,
  listResouce,
  listRole
} = require('../../controllers/rbac.controller')

//role
router.post('/role', asyncHandler(newRole))
router.get('/role', asyncHandler(listRole))

//resource
router.post('/resource', asyncHandler(newResouce))
router.get('/resource', asyncHandler(listResouce))


module.exports = router