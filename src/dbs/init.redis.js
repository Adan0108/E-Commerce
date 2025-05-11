'use strict'

// const redis = require('redis')

// //create new client redis

// const client = redis.createClient({
//   host,
//   port,
//   password,
//   username
// })

// client.on('error', err =>{
//   console.log('Redis error :' , err)
// })

// module.exports = client

const redis = require('redis')
const { RedisErrorResponse } = require('../core/error.response')

let client = {} , statusConnectRedis = {
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
    console.log(`connectionRedis - Connection status: connected`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.END, () =>{
    console.log(`connectionRedis - Connection status: disconnected`)
    //connect retry
    handleTimeoutError()
  })

  connectionRedis.on(statusConnectRedis.RECONNECT, () =>{
    console.log(`connectionRedis - Connection status: reconnecting`)
    clearTimeout(connectionTimeout)
  })

  connectionRedis.on(statusConnectRedis.ERROR, (err) =>{
    console.log(`connectionRedis - Connection status: error ${err}`)
    handleTimeoutError()
  })
}

const initRedis = async() =>{

  const instanceRedis = redis.createClient()
  client.instanceConnect = instanceRedis
  handleEventConnect({
    connectionRedis : instanceRedis
  })
  try {
    await instanceRedis.connect(); 
    console.log('Redis connection established');
    client.instanceConnect = instanceRedis;
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
  
}

const getRedis = () => client

const closeRedis = async () => {
  if (client.instanceConnect) {
    await client.instanceConnect.quit();
    console.log('Redis connection closed');
  }
};

module.exports = {
  initRedis,
  getRedis,
  closeRedis
}