const cloudinary = require("cloudinary").v2;
require("dotenv").config();
function getCloudinaryConnect() {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.error("error occured while connecting with cloudinary ", error);
    process.exit(1);
  }
}

module.exports=getCloudinaryConnect;