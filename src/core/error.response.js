'use strict'

// const StatusCode = {
//   FORBIDDEN: 403,
//   CONFLICT : 409
// }

// const ReasonStatusCode = {
//   FORBIDDEN: 'Bad request error',
//   CONFLICT : 'Conflict error'
// }

// const logger = require('../loggers/winston.log')
const myLogger = require('../loggers/mylogger.log')

const {
  StatusCode,
  ReasonStatusCode,
} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {

  constructor(message, status) {
    super(message)
    this.status = status
    this.now = Date.now()

    //Log the error use winston
    // logger.error(`${this.status} - ${this.message}`)
    // myLogger.error(this.message , ['/api/v1/login', 'vv3344', {error:'Bad request error'}])
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(message = ReasonStatusCode.UNAUTHORIZED, statusCode = StatusCode.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

class NotFoundError extends ErrorResponse {
  constructor(message = ReasonStatusCode.NOT_FOUND, statusCode = StatusCode.NOT_FOUND) {
    super(message, statusCode)
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(message = ReasonStatusCode.FORBIDDEN, statusCode = StatusCode.FORBIDDEN) {
    super(message, statusCode)
  }

}


module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError
}
