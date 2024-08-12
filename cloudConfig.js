//Before we upload file(image) on cloudinary, we have to access it
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");     //for to store file

cloudinary.config({                  //config means to to join backend with cloudinary account
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


//store file in cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "wanderlust_DEV",      //add folder in cloudinary account
        allowerdFormats: ["png", "jpg", "jpeg"], //file formats to store file
    },
});

module.exports = {
    cloudinary,
    storage,
};