import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

export const varifyJWT = asyncHandler(async(req, res, next) =>{
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
  if (!token) {
    throw new ApiError(401, "Unauthorized request")    
  }


})