'use strict'

const Redis = require('ioredis')
const { RedisErrorResponse } = require('../core/error.response')

let clients = {} , statusConnectRedis = {
  CONNECT : 'connect',
  END: 'end',
  RECONNECT: 'reconnecting',
  ERROR: 'error'
}, connectionTimeout

const REDIS_CONNECT_TIMEOUT = 10000, REDIS_CONNECT_MESSAGE ={
  code: -99,
  message: {
    vn: 'Redis loi roi',
    en: 'Redis Service connection error'
  }
}

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNECT_MESSAGE.message.vn,
      statusCode: REDIS_CONNECT_MESSAGE.code
    })
  }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnect = ({
  connectionRedis
}) => {
  //check if connect is null
  connectionRedis.on(statusConnectRedis.CONNECT, () =>{
    console.log(`connectionIORedis - Connection status: connected`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.END, () =>{
    console.log(`connectionIORedis - Connection status: disconnected`)
    //connect retry
    handleTimeoutError()
  })

  connectionRedis.on(statusConnectRedis.RECONNECT, () =>{
    console.log(`connectionIORedis - Connection status: reconnecting`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.ERROR, (err) =>{
    console.log(`connectionIORedis - Connection status: error ${err}`)
    handleTimeoutError()
  })
}

const init = async({
  IOREDIS_IS_ENABLE ,
  IOREDIS_HOST = process.env.REDIS_CACHE_HOST,
  IOREDIS_PORT = 6379
}) =>{
  if (IOREDIS_IS_ENABLE){
    const instanceRedis = new Redis({
      host : IOREDIS_HOST,
      port: IOREDIS_PORT
      })
    clients.instanceConnect = instanceRedis
    handleEventConnect({
      connectionRedis : instanceRedis
    })
  }  
}

const getIORedis = () => clients 

const closeRedis = async () => {
  if (clients.instanceConnect) {
    await clients.instanceConnect.quit();
    console.log('Redis connection closed');
  }
};

module.exports = {
  init,
  getIORedis,
  closeRedis
}