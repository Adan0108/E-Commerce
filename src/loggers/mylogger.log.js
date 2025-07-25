'use strict'
/**
 * @class MyLogger
 * @description
 */

/*
  error : nghiem trong anh huong den hoat dong cua code va doanh nghiep,
  warning : cac loi chung it anh huong den doanh nghiep,
  debug : su dung de nam trong moi truong developemtn,
  info : ghi lai cac thong tin quan trong de khac phuc su co,
  requestId or traceId : thong tin chi tiet chi ghi vao file log
 */

  
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { v4: uuidv4 } = require('uuid');


class MyLogger{
    constructor(){
      const formatPrint = format.printf(
        ({level , message , context, requestId, timestamp , metadata}) => {
          return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`
        }
      )

      this.logger = createLogger({
        format: format.combine(
          format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
          formatPrint
        ),
        transports: [
          new transports.Console(),
          new transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'application-%DATE%.info.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true, //luu giu file thanh zip de backup truoc khi xoa
            maxSize: '1m', //dung luong
            maxFiles: '14d', //xoa cac log trong vong 14 ngay
            format: format.combine(
              format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
              formatPrint
            ),
            level: 'info'

          }),
          new transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'application-%DATE%..error.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true, //luu giu file thanh zip de backup truoc khi xoa
            maxSize: '1m', //dung luong
            maxFiles: '14d', //xoa cac log trong vong 14 ngay
            format: format.combine(
              format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A'}),
              formatPrint
            ),
            level: 'error'
          })
        ]
      })
     
    }

    commonParams(params){
      let context , req, metadata;
      if(!Array.isArray(params)){
        context = params
      }else{
        [context,req,metadata] = params;
      }
      const requestId = req?.requestId || uuidv4()
      return {
        requestId,
        context,
        metadata
      }
    }
    log(message,params){
      const paramLog = this.commonParams(params)

      const logObject = Object.assign({
       message 
      }, paramLog)
      this.logger.info(logObject)
    }

    error(message,params){
      const paramLog = this.commonParams(params)
      const logObject = Object.assign({
       message 
      }, paramLog)
      this.logger.error(logObject)
    }
}

module.exports = new MyLogger()