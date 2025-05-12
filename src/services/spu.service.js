'use strict'

const { NotFoundError } = require("../core/error.response")
const { findShopById } = require("../models/repositories/shop.repo")
const spuModel = require("../models/spu.model")
const { randomProductId } = require("../utils")
const { newSku, allSkuBySpuId } = require("./sku.service")
const _ = require("lodash")

const newSpu = async({
  product_id,
  product_name,
  product_thumb,
  product_description,
  product_price,
  product_category,
  product_shop,
  product_attributes,
  product_quantity,
  product_variations,
  sku_list = []
}) =>{
  try {
    // 1. check if shop exists
    const foundShop = await findShopById({
      shop_id : product_shop
    })
    if(!foundShop){ throw new NotFoundError("Shop not found")}

    // 2. Create new SPU
    const spu = await spuModel.create({
      product_id : randomProductId(),
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_attributes,
      product_quantity,
      product_variations,
    })

    //3. get spu_id add to sku.service
    if(spu && sku_list.length){
      //3. create skus
      newSku({sku_list , spu_id : spu.product_id}).then()
    }
    

    //4. sync data via elastic search ( search service)

    //5. response result
    return !!spu
  } catch (error) {
    
  }
}

const oneSpu = async({ spu_id }) => {
  try {
    const spu = await spuModel.findOne({
      product_id : spu_id,
      isPublished : false //should change to true later
    })
    if(!spu){ throw new NotFoundError("Spu not found")}
    const skus = await allSkuBySpuId({product_id : spu.product_id})

    return {
      spu_info: _.omit(spu, ['__v', 'updatedAt']),
      sku_list: skus.map(sku => _.omit(sku, ['__v','updatedAt','createdAt','isDeleted']))
    }
  } catch (error) {
    throw new NotFoundError(error.message)
  }
}

module.exports = {
  newSpu,
  oneSpu
}