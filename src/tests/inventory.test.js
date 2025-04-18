const RedisPubSubService = require('../services/redisPubsub.service')

class InventoryServiceTest{
  constructor(){
    RedisPubSubService.subscribe('purchase_events', (channel,message) =>{
      InventoryServiceTest.updateInventory(message)
    })
  }
  static updateInventory(productId, quantity){
    console.log(`Update inventory ${productId} with quantity of ${quantity}`)
  }
}

module.exports = new InventoryServiceTest()