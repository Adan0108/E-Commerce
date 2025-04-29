'use strict'

const cloudinary = require("../configs/cloudinary.config");

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

module.exports = {
  uploadImageFromUrl
}