'use strict'

const CommentService = require('../services/comment.service')

const { OK , CREATED , SuccessResponse} = require('../core/success.response')

class CommentController {
  createComment = async(req , res ,next) => {
    new SuccessResponse({
      message: 'Create Comment Success!',
      metadata: await CommentService.createComment(req.body)
    }).send(res)
  }

  getCommentsByParentId = async(req , res ,next) => {
    new SuccessResponse({
      message: 'Get All Comment Success!',
      metadata: await CommentService.getCommentsByParentId(req.query)
    }).send(res)
  }
}

module.exports = new CommentController()