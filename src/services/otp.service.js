'use strict'

const crypto = require('crypto');

//model otp
const Otp = require('../models/otp.model')

const generatorTokenRandom = () => {
  const token = crypto.randomInt( 0, Math.pow ( 2, 32 ))
  return token;

}
const newOtp = async({
  email
}) =>{
  const token = generatorTokenRandom()
  const newToken = await Otp.create({
    otp_token: token,
    otp_email : email
  })

  return newToken
}

const checkEmailToken = async({
  token
}) => {
  // check token in model otp
  const hasToken = await Otp.findOne({
    otp_token : token
  }).lean()

  if(!hasToken) throw new Error('token not found')

    //delete token from model
  Otp.deleteOne( { otp_token : token }).then()

  return hasToken 
}


module.exports = {
  newOtp,
  checkEmailToken
};