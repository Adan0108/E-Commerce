'use strict'
// const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')

const { SuccessResponse } = require('../core/success.response')
const { newSpu, oneSpu } = require('../services/spu.service')
const { oneSku } = require('../services/sku.service')


class ProductController {

  /// SPU , SKU ///
  findOneSpu = async (req, res, next) => {
    try {
      const { product_id } = req.query;
      new SuccessResponse({
        message : " get spu one success",
        metadata: await oneSpu({spu_id : product_id})
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  findOneSku = async (req, res, next) => {
    try {
      const { sku_id , product_id } = req.query;
      new SuccessResponse({
        message : " get sku one success",
        metadata: await oneSku({sku_id , product_id})
      }).send(res)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @desc new a spu
   * @param {*} req 
   * @param {*} res 
   * @param {*} next 
   */
  createSpu = async (req, res, next) => {
    try {
      const spu = await newSpu({
        ...req.body,
        product_shop : req.user.userId
      })
      new SuccessResponse({
        message: 'Success create spu',
        metadata: spu
      }).send(res)

    } catch (error) {
      next(error)
    }
  }

  /// END SPU , SKU ///

  createProduct = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'Create Product Created Success!',
    //   metadata: await ProductService.createProduct(req.body.product_type , {
    //     ...req.body,
    //     product_shop: req.user.userId
    //   })
    // }).send(res)
    new SuccessResponse({
      message: 'Create Product Created Success!',
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  //update Product
  updateProduct = async (req, res, next) => {
    // console.log('Updating product with ID:', req.params.productId);

    new SuccessResponse({
      message: 'Update Product Success!',
      metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'publishProductByShop Success!',
      metadata: await ProductServiceV2.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'unPublishProductByShop Success!',
      metadata: await ProductServiceV2.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId
      })
    }).send(res)
  }
  // QUERY //
  /**
   * @desc Get all Drafts for shop
   * @param {Number} limit
   * @param {Number} skip 
   * @return {JSON} 
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Draft Success!',
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get List Publish Success!',
      metadata: await ProductServiceV2.findAllPublishForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }
  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get getListSearchProduct Success!',
      metadata: await ProductServiceV2.searchProducts(req.params)
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findAllProducts Success!',
      metadata: await ProductServiceV2.findAllProducts(req.query)
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get findOneProduct Success!',
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }

  // END QUERY //
}

module.exports = new ProductController()