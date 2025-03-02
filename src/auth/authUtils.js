'use strict'

const JWT = require('jsonwebtoken')
const createTokenPair = async ( payload , publicKey , privateKey ) => {
  try {
    //payload = infor to transer from system to another system through token
    //privateKey = private key for sign only happen one and not save to database, only use for client browser

    //accessToken
    const accessToken = await JWT.sign(payload, publicKey , {

      expiresIn: '2 days'
    })
    const refreshToken = await JWT.sign(payload, privateKey , {

      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error('error verify ::', err)
      } else {
        console.log('decoded ::', decoded)
      }
    })
    return { accessToken , refreshToken }

  } catch (error) {
    return error
  }
}

module.exports = {
  createTokenPair
}