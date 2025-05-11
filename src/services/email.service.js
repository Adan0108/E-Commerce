'use strict';

const { newOtp } = require('./otp.service');
const { getTemplate } = require('./template.service');
const transport = require('../dbs/init.nodemailer');
const { NotFoundError } = require('../core/error.response');
const { replacePlaceholder } = require('../utils');

const sendEmailLinkVerify = async({  
  html,
  toEmail,
  subject = 'xac nhan email dang ky',
  text = 'vui long click vao link de xac nhan email dang ky'}) => {
    try {
      const mailOptions = {
        from: '"E-commerce" <quanganhle0108@gmail.com>',
        to: toEmail,
        subject,
        text,
        html
      }

      transport.sendMail(mailOptions , (err,info) => {
        if(err){
          return console.log(err)
        }

        console.log('Message sent ::', info.messageId)
      })
    } catch (error) {
      console.log("error send Email ::" , error)

      return error
      
    }
}

const sendEmailToken = async({
  email = null
}) =>{
  try {
    // 1. get token
    const token = await newOtp({ email })

    // 2. get Template
    const template = await getTemplate({ 
      tem_name : 'HTML EMAIL TOKEN'
     })

     if(!template) throw new NotFoundError('template not found')


     // 3. replace placeholder with paramas

     const content = replacePlaceholder(
      template.tem_html, {
        link_verify : `http://localhost:3056/cgp/welcome-back?token=${token.otp_token}`
      }
     )
     // 4. send email

     sendEmailLinkVerify({
      html: content ,
      toEmail : email,
      subject : 'xac nhan email dang ky trang web'
     }).catch( err => console.log(err))

     return 1

  }catch (error) {

  }

} 

module.exports = {
  sendEmailToken
}