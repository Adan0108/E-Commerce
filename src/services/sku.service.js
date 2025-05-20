'use strict'

const _ = require("lodash")

const skuModel = require("../models/sku.model")
const { randomProductId } = require("../utils")
const { CACHE_PRODUCT } = require("../configs/constant")
const { getCacheIO, setCacheIOExpiration } = require("../models/repositories/cache.repo")

const newSku = async({ spu_id , sku_list}) =>{
  try {
    const convert_sku_list = sku_list.map( sku => {
      return {...sku, product_id : spu_id, sku_id : `${spu_id}.${randomProductId()}`}
    })
    const skus = await skuModel.create(convert_sku_list)
    return skus
  } catch (error) {
    return []
  }
}

const oneSku = async({sku_id , product_id}) => {
  try {
    // 1. Check params
    if(sku_id < 0){
      return null
    }
    if(product_id < 0){
      return null
    }

    //2. Read cache
    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}` //key cache
    // let skuCache = await getCacheIO({  key : skuKeyCache })
    // if(skuCache){
    //   return {
    //     ...JSON.parse(skuCache),
    //     toLoad: 'cache' // dbs
    //   }
    // }

    // 3. Read from dbs
    //if(!skuCache){
      // 4. Read from dbs
      const skuCache = await skuModel.findOne({
        sku_id , product_id
      }).lean()

      const valueCache = skuCache ? skuCache : null
      setCacheIOExpiration({
        key : skuKeyCache,
        value : JSON.stringify(valueCache),
        expirationInSeconds : 30
      }).then()

      //return
    //}  

    return {
        skuCache,
        toLoad: 'dbs' // dbs
      }

    // const sku = await skuModel.findOne({
    //   sku_id, product_id
    // }).lean()

    // if(sku){
    //   // set cache
    // }
    // return _.omit(sku , ['__v','updatedAt','createdAt','isDeleted'])

  } catch (error) {
    return null
  }
}

const allSkuBySpuId = async({ product_id }) => {
  try{
    // 1. spu_id...
    const skus = await skuModel.find({product_id}).lean()
    return skus

  }catch(error){

  }
}
module.exports = {
  newSku,
  oneSku,
  allSkuBySpuId
}