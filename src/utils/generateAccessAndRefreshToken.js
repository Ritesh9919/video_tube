

import { User } from "../models/user.model.js";



export const generateAccessAndRefreshTokens = async(userId)=> {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});

    return {accessToken, refreshToken}
}