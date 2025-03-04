'use strict'
const AccessService = require('../services/access.service')

const { OK , CREATED} = require('../core/success.response')
/*
200 OK
201 CREATED
*/
class AccessController {
  signUp = async (req, res, next) => {
    // try {
      // console.log(`[P]::signUp::`, req.body)
      // return res.status(201).json(
      //   await AccessService.signUp(req.body)
      // )
    // } catch (error) {
    //   next(error)
    // }
    new CREATED({
      message: 'RegisterOK!',
      metadata: await AccessService.signUp(req.body),
      options:{
        limit: 10
      }
    }).send(res)
  }
}
module.exports = new AccessController();