'use strict'

const { product , clothing , electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

// define Factory class to create product
class ProductFactory {
  static productRegistry = {} //key class

  static registerProductType(type , classRef){
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct( type , payload ){

    const productClass = ProductFactory.productRegistry[type]

    if (!productClass) throw new BadRequestError(`Invalid type ${type}`)
    return new productClass(payload).createProduct()

  }
}

//define base product class
class Product{
  constructor({product_name, product_thumb, product_description ,product_price , 
    product_quantity,product_type,product_shop,product_attributes}){
      this.product_name = product_name
      this.product_thumb = product_thumb
      this.product_description = product_description
      this.product_price = product_price
      this.product_quantity = product_quantity
      this.product_type = product_type
      this.product_shop = product_shop
      this.product_attributes = product_attributes
  }
  //create new product
  async createProduct(product_id){
    return await product.create({...this, _id:product_id})
  }
}

//Define sub-class for different product types Clothing
class Clothing extends Product{
  async createProduct(){
    const newClothing = await clothing.create({
      ...this.product_attributes,
    product_shop: this.product_shop})
    if(!newClothing) throw new BadRequestError("create new Clothing Error")

    const newProduct = await super.createProduct(newClothing._id)
    if(!newProduct) throw new BadRequestError("create new Product Error")
      return newProduct
  }
}

//Define sub-class for different product types Electronics
class Electronics extends Product{
  async createProduct(){
    const newElectronics = await electronic.create({
      ...this.product_attributes,
    product_shop: this.product_shop})
    if(!newElectronics) throw new BadRequestError("create new Electronics Error")

    const newProduct = await super.createProduct(newElectronics._id)
    if(!newProduct) throw new BadRequestError("create new Product Error")
      return newProduct
  }
}

//Define sub-class for different product types newFuriture
class Furniture extends Product{
  async createProduct(){
    const newFuriture = await furniture.create({
      ...this.product_attributes,
    product_shop: this.product_shop})
    if(!newFuriture) throw new BadRequestError("create new newFuriture Error")

    const newProduct = await super.createProduct(newFuriture._id)
    if(!newProduct) throw new BadRequestError("create new Product Error")
      return newProduct
  }
}

//register product types
ProductFactory.registerProductType('Electronics' , Electronics)
ProductFactory.registerProductType('Clothing' , Clothing)
ProductFactory.registerProductType('Furniture' , Furniture)

module.exports = ProductFactory;