'use strict'

const { model , Schema , Types } = require('mongoose')

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

//ORDER-001: Order Success
//ORDER-002: Order Failed
//PROMOTION-001: new Promotion
//SHOP-001: new product by User following

const notificationSchema = new Schema({
  noti_type: {
    type: String,
    enum: ['ORDER-001','ORDER-002','PROMOTION-001','SHOP-001'],
    required: true
  },
  noti_senderId:{
    type: Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  noti_receivedId:{
    type: Number,
    required: true
  },
  noti_content:{
    type: String,
    required: true
  },
  noti_options:{
    type : Object,
    default : {}
  }, //ban nhan dc mot voucher cua shop ABC
},
{
  timestamps : true,
  collection : COLLECTION_NAME
})

module.exports = {
  NOTI: model(DOCUMENT_NAME, notificationSchema)}
