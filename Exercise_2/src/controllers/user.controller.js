import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler( async (req, res) =>
  {
    // get user details from user frontend
    // validation not Empaty
    // Check user already exist
    // chack images and avatar 
    // upaload them cloudinary, avatar
    // craete user object in db 
    // reamove password and refresh tokaen feild from response 
    // chech for user creation 
    // return response
    const {fullName, email, username, password} = req.body;
    if (
      [fullName, email, username, password].some((fields)=>fields?.trim() === "")
    ) {
      throw new ApiError(400, "All fields are required")
    }
    

    const userExist = User.findOne({
      $or : [{username}, {email}]
    })
    if (userExist) {
      throw new ApiError(409, "User already Exists")
    }








  })
export {
  registerUser,
}