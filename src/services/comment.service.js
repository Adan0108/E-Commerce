'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { convertToObjectIdMongodb } = require('../utils')

class CommentService {
/*
  key featuures : Comment Service
  * add comment [User|Shop]
  * get a list of comments [USer|Shop]
  * delete a comment [User|Shop|Admin]
 */

  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }){
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    })

    let rightValue
    if (parentCommentId){
      //reply comment
      const parentComment = await Comment.findById(parentCommentId)
      if(!parentComment){
        throw new NotFoundError('Parent comment not found')
      }
      rightValue = parentComment.comment_right
      //updating comments
      await Comment.updateMany({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: {$gte: rightValue},
      } , {
        $inc: {comment_right: 2}
      })

      await Comment.updateMany({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: {$gte: rightValue},
      } , {
        $inc: {comment_left: 2}
      })
    } else {
      const maxRightValue = await Comment.findOne({
        comment_productId: convertToObjectIdMongodb(productId),
      }, 'comment_right', {sort: {comment_right: -1}})
      if(maxRightValue){
        rightValue = maxRightValue.comment_right + 1
      }
      else {
        rightValue = 1
      }
    }

    //insert comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()
    return comment
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0 //skip
  }){
    if(parentCommentId){
      const parent = await Comment.findById(parentCommentId)
      if(!parent){
        throw new NotFoundError('Not found comment for product')
      }

      const comments = await Comment.find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: {$gt: parent.comment_left},
        comment_right: {$lt: parent.comment_right},
      }).select({
        comment_left : 1,
        comment_right : 1,
        comment_content : 1,
        comment_parentId : 1,
      }).sort({
        comment_left: 1
      })
      return comments
    }


    const comments = await Comment.find({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_parentId: parentCommentId,
    }).select({
      comment_left : 1,
      comment_right : 1,
      comment_content : 1,
      comment_parentId : 1,
    }).sort({
      comment_left: 1
    })
    return comments

  }
}

module.exports = CommentService 