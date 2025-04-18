'use strict'

const { model , Schema , Types } = require('mongoose')

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';
//we use the nested comment model for faster query and better performance
//we can use the tree structure to store the comment and reply comment
//why it faster? becasue we can use the left and right value to store the comment and reply comment
//when we find it the comment child we can use: 
// {comment child of commentid : they will be > left and < right}
const commentSchema = new Schema({
  comment_productId : {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  comment_userId : {
    type: Number,
    default: 1
  },
  comment_content : {
    type: String,
    default: 'text'
  },
  comment_left: {
    type: Number,
    default: 0
  },
  comment_right: {
    type: Number,
    default: 0
  },
  comment_parentId : {
    type: Schema.Types.ObjectId,
    ref: DOCUMENT_NAME,
  },
  isDeleted : {
    type: Boolean,
    default: false
  },
},
{
  timestamps : true,
  collection : COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, commentSchema)
