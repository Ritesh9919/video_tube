import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js';
import {asyncHandler, ApiError, ApiResponse, uploadOnCloudinary, generateAccessAndRefreshTokens} from '../utils/index.js';




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


const loginUser = asyncHandler(async(req, res)=> {
    // get user details from fronted
    const {email, username, password} = req.body;
    // validation
       if(!email || !username) {
        throw new ApiError(400, "username or password is required");
       }
    // check if user exist
      const user = await User.findOne({$or:[{email},{username}]});
    // if user exist - then check password
    if(!user) {
        throw new ApiError(400, "user does not exist");
    }
    
    // check user password
    const isPasswordCorrect = await user.isPasswordCurrect(password);
    if(!isPasswordCorrect) {
        throw new ApiError(400, "Password is incorrect");
    }

    //generate access and refresh token and store refreshToken in database
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    // login user
    const loginUser = await User.findOne(user._id).select("-password -refreshToken");

    // return response with accessToken and refreshToken
    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, {user: loginUser, accessToken, refreshToken}, "Login successfull"));
    
})




const logoutUser = asyncHandler(async(req, res, next)=> {
  await User.findByIdAndUpdate(
    req.user._id,
    {$unset:{refreshToken:1}},
    {new:true}
  )

  const option = {
    httpOnly:true,
    secure:true
  }

  return res.status(200)
  .clearCookie("refreshToken", option)
  .clearCookie("accessToken", option)
  .json(new ApiResponse(200, {}, "Logout successfull"));
})



const refreshAccessToken = asyncHandler(async(req, res, next)=> {
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
   if(!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
   }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

   const user = await User.findById(decodedToken?.userId);

   if(!user) {
    throw new ApiError(401, "Invalid refresh token");
   }

   if(incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "RefreshToken is expired or use");
   }

   const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
   const option = {
    httpOnly:true,
    secure:true
   }

   return res.status(200)
   .cookie("accessToken", option)
   .cookie("refreshToken", option)
   .json(new ApiResponse(200, {accessToken, refreshToken}, "access token refresh"));

  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid refresh token");
  }
   



})


const changeCurrentPassword = asyncHandler(async(req, res, next)=> {
    const {newPassword, oldPassword} = req.body;
    if(!oldPassword || !newPassword) {
        throw new ApiError(400, "Both fields are required");
    }

    const user = await User.findById(req.user._id);
     const isPasswordCorrect = await user.isPasswordCurrect(oldPassword);
     if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
     }

     user.password = newPassword;
     await user.save({validateBeforeSave:false});

     return res.status(200)
     .json(new ApiResponse(200, {}, "Password updaded successfully"));
})



const getCurrentUser = asyncHandler(async(req, res, next)=> {
    return res.status(200)
    .json(new ApiResponse(200, req.user, "User fetched succesfully"));
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser
}