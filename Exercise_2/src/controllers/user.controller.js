import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

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
    

    const userExist = await User.findOne({
      $or : [{username}, {email}]
    })
    if (userExist) {
      throw new ApiError(409, "User already Exists")
    }

    //console.log(req.files)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    //console.log("local Path of avatar is "+avatarLocalPath);

    if (!avatarLocalPath) {
      throw new ApiError(400, "avatar fields are required");
    }


    const avatar = await uploadCloudinary(avatarLocalPath);
    const coverImage = await uploadCloudinary(coverImageLocalPath);
    //console.log(avatar);
    if (!avatar) {
      throw new ApiError(400, "avatar fields are required");
    }

    const user = await User.create({
      fullName,
      avatar : avatar.url,
      coverImage : coverImage?.url || "",
      email,
      password,
      username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )
    if (!createdUser) {
      throw new ApiError(500, "Somthing went wrong while registering the user");
    }

    return res.status(201).json(
      new apiResponse(200, createdUser, "User Registered Successfully")
    )



  })
export {
  registerUser,
}