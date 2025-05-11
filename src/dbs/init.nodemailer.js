'use strict'

const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
  ,
    tls: {
    rejectUnauthorized: false // ✅ allow self-signed cert
  }
});


module.exports = transport


