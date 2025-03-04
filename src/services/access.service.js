'use strict'

const shopModel = require("../models/shop.model");
const bcrypt = require('bcrypt');
const crypto = require('node:crypto');
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../core/error.response");

const { findByEmail } = require('./shop.service')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: '00001', //this code is use for writer role but we only show client the code for secure
  EDITOR: '00002',
  ADMIN: '00003',
}

class AccessService {
  /*
   1- Check email in dbs
   2- Match password
   3 - Create AT and RT and save
   4 - Generate tokens
   5 - Get data return login
  */
  static login = async ({ email, password, refreshToken = null }) => {
    //1
    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError('Shop not register')
    }
    //2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError('Authentication failed')
    }
    //3 create private and public key
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    //4 create token
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({
      userId,
      email
    }, publicKey, privateKey)
    await keyTokenService.createKeyToken({
      refreshToken : tokens.refreshToken,
      privateKey, publicKey,
      userId
    })
    return {
        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: foundShop }),
        tokens
    }


  }

  static signUp = async ({ name, email, password }) => {
    try {
      //step 1 :check if email already exists ( use lean for java opject to reduce the size and time)
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {

        throw new BadRequestError('Email already exists')

      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // create privateKey , publicKey : Private key use for client to sign the token, publicKey use for server to verify the token


        //Public key CryptoFraphy Standard 1

        //we use this simple techinique for this project Instead
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')


        console.log({ privateKey, publicKey }) //save collection KeyStore

        const keyStore = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: 'xxxx',
            message: 'keyStore error'
          }
        }
        // create token pair
        const tokens = await createTokenPair({
          userId: newShop._id,
          email
        }, publicKey, privateKey)

        console.log(`Create Token Success ::`, tokens) // save collection TokenPair

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop }),
            tokens
          }
        }
      }
      return {
        code: 200,
        metadata: null
      }
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }

}

module.exports = AccessService;