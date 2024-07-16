import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';



export const uploadOnCloudinary = async(localFilePath)=> {
   try {
      if(!localFilePath) {
        return null;
      }
  // upload
  const response = await cloudinary.uploader.upload(localFilePath, {
    resource_type:'auto'
  })
 
  console.log("File has been uploaded successfully on cloudinary", response.url);
  fs.unlinkSync(localFilePath);
  return response;

   } catch (error) {
     fs.unlinkSync(localFilePath);
     return null;
   }
}