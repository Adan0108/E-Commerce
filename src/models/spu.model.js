'use strict';

const { model, Schema, Types } = require('mongoose')

const slugify = require('slugify');

const DOCUMENT_NAME = 'Spu';
const COLLECTION_NAME = 'spus';

const productSchema = new Schema({
  product_id: { type: String, default: '' },
  product_name: { type: String, required: true, },
  product_thumb: { type: String, required: true, },
  product_description: String,
  product_slug: String, // quan-jean-cao-cap
  product_price: { type: Number, required: true, },
  product_quantity: { type: Number, required: true },
  // product_type:{
  //   type: String,
  //   required: true,
  //   enum : ['Electronics', 'Clothing', 'Furniture']
  // },
  product_category: { type: Array, required: [] },
  product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  /*
   {
          attributes_id: 12345, // style ao [ han quoc , thoi trang , mua he]
          attribute_values:[
          {
            value_id: 1234
          }
          ]
    }
   */
  product_attributes: { type: Schema.Types.Mixed, required: true },
  //more
  product_ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, "Rating must above 1.0"],
    max: [5, "Rating must below 5.0"],
    set: (val) => Math.round(val * 10) / 10
  },
  /*
      tier_variation : [
      {
       images: [],
       name: "color",
       options: ['red','greenn','blue','white','black']
      }, {
       name: 'size,
       options:['S',,'M','L','XL','XXL'],
       images: []

      }
      ]
   */
  product_variations: { type: Array, default: [] },
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
//create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })
//Document middleware: run before .save() and .create()...
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

module.exports = model(DOCUMENT_NAME, productSchema)