'use strict';

const { ThreadAutoArchiveDuration } = require('discord.js');
const { model, Schema, Types } = require('mongoose')


const DOCUMENT_NAME = 'Sku';
const COLLECTION_NAME = 'skus';

const skuSchema = new Schema({
  sku_id: { type: String, require: true, unique: true },//string string "{spuid}1234{shopid}"
  sku_tier_idx: { type: Array, default: [0] },
  /*
     colour = [red,green] = [0,1],
     size = [S,M] = [0,1]

     ==> red = S = [0,0]
     ==> red = M = [0, 1]
   */
  sku_default: { type: Boolean, default : false },
  sku_slug: { type:String, default: ''},
  sku_sort: { type: Number, default: 0}, //muc do uu tien cua san pham
  sku_prices: { type: String , require : true },
  sku_stock: { type: Number, default: 0 }, //array in of stock
  product_id : {type:String, require: true}, //ref to spu product
  
  isDraft: {
    type: Boolean,
    default: true,
    index: true,
    select: false
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
    select: true
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, skuSchema)