'use strict'

const { SuccessResponse } = require("../core/success.response")
const { createResource, createRole, roleList, resourceList } = require("../services/rbac.service")

/**
 * @description: Create new role
 * @param {string} name 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
  new SuccessResponse({
    message: 'Created role successfully',
    metadata: await createRole( req.body ) 
  }).send(res)
}

const newResouce = async (req, res, next) => {
  new SuccessResponse({
    message: 'Created resource successfully',
    metadata: await createResource( req.body ) 
  }).send(res)
}

const listRole = async (req, res, next) => {
  new SuccessResponse({
    message: 'get list role successfully',
    metadata: await roleList( req.query ) 
  }).send(res)
}

const listResouce = async (req, res, next) => {
  new SuccessResponse({
    message: 'get list resource successfully',
    metadata: await resourceList( req.query ) 
  }).send(res)
}

module.exports = {
  newRole,
  newResouce,
  listRole,
  listResouce
}