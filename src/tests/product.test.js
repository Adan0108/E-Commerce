const RedisPubSubService = require('../services/redisPubsub.service')

class ProductServiceTest{

  purchaseProduct(productId, quantity){
    const order = {
      productId,
      quantity
    }
    console.log('productId', productId)
    RedisPubSubService.publish('purchase_events', JSON.stringify(order))
  }

}

module.exports = new ProductServiceTest