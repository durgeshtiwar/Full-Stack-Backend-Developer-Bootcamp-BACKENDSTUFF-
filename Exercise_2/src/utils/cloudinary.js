import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});

const uploadCloudinary = async(localFilePath) =>{
  try {
    // console.log(localFilePath);
    if(!localFilePath) return null;
    //console.log(localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type : "auto"
    }) 
    // File Uploaded Succesfully 
    //console.log("file is uploaded on cloudinary ",response.url);
    fs.unlinkSync(localFilePath);
    return response;
    
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
}
export {uploadCloudinary}