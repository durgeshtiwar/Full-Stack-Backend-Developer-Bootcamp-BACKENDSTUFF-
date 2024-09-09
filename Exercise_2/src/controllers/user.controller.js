import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshTokens = async(userId) =>{
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken =  user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false });
    // console.log("Acceses token" + accessToken);
    // console.log("refres token" + refreshToken);
    return {accessToken, refreshToken};

  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access refresh token")
  }
}

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
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }

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

const loginUser = asyncHandler( async(req, res) =>{

  //req.body -> data
  //username or Email
  //find User
  //Password Check
  //Access and refresh Token
  //send cookies

  const {username, email, password} = req.body
  if (!username && !email) {
    throw new ApiError(400,"username and email is required")    
  }

  const user = await User.findOne({
    $or : [{username},{email}]
  })

  if (!user) {
    throw new ApiError(404,"User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401,"Invalid credentials")
  }

  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
  // console.log("Acceses token" + accessToken);
  // console.log("refres token" + refreshToken);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
  )
} )

const logOutUser = asyncHandler( async(req, res) =>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken : undefined
      }
    },
    {
        new : true
    }
    )
  const options = {
  httpOnly : true,
  secure : true
  }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new apiResponse(200, {}, "User logged Out"))
})

export {
  registerUser,loginUser,logOutUser
}