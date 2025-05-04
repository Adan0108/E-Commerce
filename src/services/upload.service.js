'use strict'

const crypto = require('crypto')
const cloudinary = require("../configs/cloudinary.config");
const { s3, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('../configs/s3.config')
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');
const { random, get } = require('lodash');
const urlImagePublic = process.env.CLOUDFRONT_URL

const randomImageName = () => crypto.randomBytes(16).toString('hex')
/////// upload file use S3Client ///////

// 4. upload image from local using S3Client

const uploadImageFromLocalS3 = async (
  file
) => {
  try {
  
    const imageName = randomImageName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: 'image/jpeg', // this is what you need!
    })

    //export url

    const result = await s3.send(command)

    console.log('Image uploaded successfully:', result);

    //have cloudfront url export
    const url = getSignedUrl({
      url: `${urlImagePublic}/${imageName}`,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
      dateLessThan: new Date( Date.now() + 1000 * 60), //het han 60 giay
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
    })

    //This is for the S3
    // const singedUrl = new GetObjectCommand({
    //   Bucket: process.env.AWS_BUCKET_NAME,
    //   Key: imageName,
    // })

    //This is the url for the S3
    // const url = await getSignedUrl(s3, singedUrl, { expiresIn: 3600 });
    console.log('Signed URL":', url);
    // return {
    //   image_url: result.secure_url,
    //   shopId: '1234',
    //   thumb_url: await cloudinary.url(result.public_id , {
    //     width: 100,
    //     height: 100,
    //     format: 'jpg'
    //   })
    // }
    return {
      url,
      result
    }
  } catch (error) {
    console.error('Upload error using S3Client:', error);
    throw error;  
  }
}

//////// END S3 Service ///////

// 1. upload from url image

const uploadImageFromUrl = async (url) => {
  try {
    const urlImage = 'https://shopee.co.th/blog/wp-content/uploads/2022/12/Shopee-blog-standard-delivery-%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3-online-shopping-1140x800.jpg';
    const folderName = 'product/shopId', newFileName = 'testdemo'
    const result = await cloudinary.uploader.upload(urlImage, {
      folder: folderName,
      public_id: newFileName,
    });
    console.log('Image uploaded successfully:', result);
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;  
  }
}

// 2. upload image from local 

const uploadImageFromLocal = async (
  path,
  folderName = 'product/1234',
) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      folder: folderName,
      public_id: 'thumb',
    });
    console.log('Image uploaded successfully:', result);
    return {
      image_url: result.secure_url,
      shopId: '1234',
      thumb_url: await cloudinary.url(result.public_id , {
        width: 100,
        height: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.error('Upload error:', error);
    throw error;  
  }
}

// 3. upload nhieu image from local 

const uploadImageFromLocalFiles = async (
  files,
  folderName = 'product/1234',
) => {
  try {
    console.log('files', files , folderName)
    if(!files.length){
      return
    }

    const uploadUrls = []

    for (const file of files){
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      })
      uploadUrls.push({
        image_url: result.secure_url,
        shopId: '1234',
        thumb_url: await cloudinary.url(result.public_id , {
          width: 100,
          height: 100,
          format: 'jpg'
        })
      })
    }

    console.log('Image uploaded successfully:', uploadUrls);
    return uploadUrls
  } catch (error) {
    console.error('Upload error:', error);
    throw error;  
  }
}

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
  uploadImageFromLocalS3
}