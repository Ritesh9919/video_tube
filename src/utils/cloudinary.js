import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';



export const uploadOnCloudinary = (localFilePath)=> {
   try {
      if(!localFilePath) {
        return null;
      }
  // upload
  const response = cloudinary.uploader.upload(localFilePath, {
    resource_type:'auto'
  })
 
  console.log("File has been uploaded successfully on cloudinary", response.url);
  return response;

   } catch (error) {
     fs.unlinkSync(localFilePath);
     return null;
   }
}