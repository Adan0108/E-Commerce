'use strict'

const {
  listNotiByUser
} = require('../services/notification.service')

const { OK , CREATED , SuccessResponse} = require('../core/success.response')

class NotificationController {


  listNotiByUser = async(req , res ,next) => {
    new SuccessResponse({
      message: 'Get All Noti Success!',
      metadata: await listNotiByUser(req.query)
    }).send(res)
  }

}

module.exports = new NotificationController()