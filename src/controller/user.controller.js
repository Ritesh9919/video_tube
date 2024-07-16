import e from 'express';
import {User} from '../models/user.model.js';
import {asyncHandler, ApiError, ApiResponse, uploadOnCloudinary} from '../utils/index.js';




const registerUser = asyncHandler(async(req, res, next)=> {
   // get user details from fronted
   const {fullName, username, email, password}  = req.body;
   // validation
   if([fullName, email, password, username].some((field)=> field.trim() == "")) {
    throw new ApiError(400, "All fields are required");
   }
   // check if user already exist
   const existedUser = await User.findOne({$or:[{email},{username}]});
   if(existedUser) {
    throw new ApiError(400, "User already registered");
   }
   // check for image - avatar
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;


   //console.log(avatarLocalPath, coverImageLocalPath);

   if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
   }
   // if exist upload on cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);
   // create user object - create entry in db
   const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar:avatar.url,
    coverImage:coverImage.url
   })

   // check for user creation
   if(!user) {
    throw new ApiError(400, "Something went wrong while registring user");
   }
   // remove password and refresh token from response
   const createdUser = await User.findById(user._id).select("-password -refreshToken");
   
   // return response
   return res.status(201)
   .json(new ApiResponse(200, {user:createdUser}, "Registration successfully"));

})


export {
    registerUser
}