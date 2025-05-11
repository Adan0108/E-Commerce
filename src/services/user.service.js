'use strict'

const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');
const User = require('../models/user.model');
const { sendEmailToken } = require('./email.service');

const newUserService = async({
  email = null,
  captcha = null,

}) =>{
  // 1. check email exists in dbs
  const user = await User.findOne({ email }).lean();

  // 2. If email exist 
  if (user) {
    return BadRequestError('Email is already registered');
  }

  // 3. Send token via email user
  const result = await sendEmailToken({email})
  console.log("➡️ Reached sendEMailLinkVerify for:", email);

  return {
    message : 'verify email user',
    metadata : {
      token : result
    }
  }

}

module.exports = {
  newUserService
}