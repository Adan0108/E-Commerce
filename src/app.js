const express = require('express');
const {default : helmet} = require('helmet'); //for security header (use to hide the tech use to run server)
const morgan = require('morgan'); //for response log
const app = express();
const compression = require('compression'); //for compressing response



//init middlewares
app.use(morgan("dev"));
app.use(helmet())
app.use(compression());

//init db

//init routes
app.get('/', (req, res, next) => {

  const strCompress = 'Hello world'

  return res.status(200).json({ 
    message: 'Welcome to the API!' ,
    metadata : strCompress.repeat(1000),
  });
})

//handle error

module.exports = app;