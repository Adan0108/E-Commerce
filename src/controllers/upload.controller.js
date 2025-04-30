'use strict'

const { BadRequestError } = require("../core/error.response")
const { SuccessResponse } = require("../core/success.response")
const { uploadImageFromUrl,
   uploadImageFromLocal,
   uploadImageFromLocalFiles,
   uploadImageFromLocalS3
   } = require("../services/upload.service")

class UploadController{
  uploadFile = async (req, res,next) => {
    new SuccessResponse({
      message: 'Upload file successfully',
      metadata: await uploadImageFromUrl()
    }).send(res)
  }

  uploadFileThumb = async (req, res,next) => {
    const { file } = req
    if(!file){
      throw new BadRequestError('File not found')
    }
    new SuccessResponse({
      message: 'Upload file thumb successfully',
      metadata: await uploadImageFromLocal(
        file.path,
      )
    }).send(res)
  }

  uploadImageFromLocalFiles = async (req, res,next) => {
    const { files } = req
    if(!files.length){
      throw new BadRequestError('File not found')
    }
    new SuccessResponse({
      message: 'Upload file thumb successfully',
      metadata: await uploadImageFromLocalFiles(
        files,
      )
    }).send(res)
  }

  // use S3
  uploadImageFromLocalS3 = async (req, res,next) => {
    const { file } = req
    if(!file){
      throw new BadRequestError('File not found')
    }
    new SuccessResponse({
      message: 'Upload file using S3Client successfully',
      metadata: await uploadImageFromLocalS3(
        file,
      )
    }).send(res)
  }

}

module.exports = new UploadController()