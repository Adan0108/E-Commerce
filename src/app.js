
require('dotenv').config(); //load environment variables
const express = require('express');
const {default : helmet} = require('helmet'); //for security header (use to hide the tech use to run server)
const morgan = require('morgan'); //for response log
const app = express();
const compression = require('compression'); //for compressing response
const {v4:uuidv4} = require('uuid') //for generating unique id
const myLogger = require('./loggers/mylogger.log')
//init middlewares
app.use(morgan("dev"));
app.use(helmet())
app.use(compression());
app.use(express.json()); // for parsing json request
app.use(express.urlencoded({
  extended:true  // support parsing of application/x-www-form-urlencoded
}))

app.use((req, res, next) => {
  const requestId = req.header['x-request-id']
  req.requestId = requestId ? requestId : uuidv4()
  myLogger.log(`input params ::${req.method}:: ` , [
    req.path,
    { requestId : req.requestId},
    req.method == 'POST' ? req.body : req.query
  ])

  next()
})


//test pub.sub redis
require('./tests/inventory.test')
const productTest = require('./tests/product.test')
productTest.purchaseProduct('product:001', 10)

//init db
require('./dbs/init.mongodb');
// const { checkOverload } = require(`./helpers/check.connect`)
// checkOverload();

// init routes
// app.get('/', (req, res, next) => {

//   // const strCompress = 'Hello world'

//   return res.status(200).json({ 
//     message: 'Welcome to the API!' ,
//     // metadata : strCompress.repeat(1000),
//   });
// })

//redis
const initRedis = require('./dbs/init.redis')
initRedis.initRedis()

//IORedis
const ioredis = require('./dbs/init.ioredis')
ioredis.init({
  IOREDIS_IS_ENABLE: true
})

app.use('/',require('./routes'))
 
//handle error
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404;
  next(error)
})


app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const resMessage = `${error.status} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`
  myLogger.error(resMessage , [
    req.path,
    { requestId : req.requestId},
    {
      message : error.message,
    }

  ])
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    stack : error.stack, //only use for developmen stage
    message: error.message || 'Internal Server Error'
  })
})

module.exports = app;