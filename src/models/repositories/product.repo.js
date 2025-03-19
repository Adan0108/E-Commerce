'use strict';

const { product, electronic, clothing, furniture } = require('../product.model')
const { Types: { ObjectId } } = require('mongoose')
const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product.find({
    isPublished:true,
    $text: { $search: regexSearch }
  }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return results;
}

const publishProductByShop = async ({ product_id, product_shop }) => {
  const foundProduct = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id),
  });

  if (!foundProduct) return null;

  const { modifiedCount } = await product.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: false, isPublished: true } }
  );

  return modifiedCount;
}

const unPublishProductByShop = async ({ product_id, product_shop }) => {
  const foundProduct = await product.findOne({
    product_shop: new ObjectId(product_shop),
    _id: new ObjectId(product_id),
  });

  if (!foundProduct) return null;

  const { modifiedCount } = await product.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: true, isPublished: false } }
  );

  return modifiedCount;
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser
}  