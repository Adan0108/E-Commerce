'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
// const redisClient = redis.createClient()


// redisClient.on('error', err => console.error('Redis‑error:', err));

// (async () => {
//   await redisClient.connect();                     // 🟢 open the connection
//   console.log('✅ Connected to Redis – PING →', await redisClient.ping());
// })();
// redisClient.ping((err, result) => {
//   if(err){
//     console.error('Error connecting to Redis::' , err)
//   }else{
//     console.log('Connected to Redis')
//   }
// })

const { getRedis } = require('../dbs/init.redis')
const {
  instanceConnect : redisClient
} = getRedis()

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnvAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async(productId , quantity, cartId) => {
  const key = `lock_v2025_${productId}`
  const retryTimes = 10;
  const expireTime = 3000 //3 second tam lock

  for (let i = 0; i < retryTimes; i++) {
    //tao mot key , thang nao nam giu duoc vao thanh toan
    const result = await setnvAsync(key, expireTime)
    console.log(`result:::`,result)
    if(result === 1){
      //thao tac voi inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId
      })
      if(isReservation.modifiedCount){
        await pexpire(key , expireTime)
        return key
      }
      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

  }
}

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock,
 
}