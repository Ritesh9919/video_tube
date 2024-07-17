import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import {asyncHandler, ApiError} from '../utils/index.js'




export const verifyJwt = asyncHandler(async(req, res, next)=> {
    const token = req.cookies?.accessToken || req.headers["authorization"].replace("Bearer", "");
    if(!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select('-password -refreshToken');
        if(!user) {
            throw new ApiError(401, "Invalid accessToken");
        }

        req.user = user;
        next();


    } catch (error) {
        throw new ApiError(401, err.message || "Invalid accessToken");
    }
})