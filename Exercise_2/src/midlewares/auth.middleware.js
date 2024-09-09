import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _ , next) =>{
  try {
    console.log("Cookis"+req.cookies.accessToken)
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    console.log("yhihai token na  "+ token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request")    
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    console.log("Kya yhi user hai"+ user)
  
    if (!user) {
      throw new ApiError(401, "Inavlid Access Token")
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("kya yhi error hai ")
    throw new ApiError(401, error?.message || "Invalid access token")
}

})