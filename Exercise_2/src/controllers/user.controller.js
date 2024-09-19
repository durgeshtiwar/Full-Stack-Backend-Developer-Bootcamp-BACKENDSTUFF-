import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

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



});

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
});

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
});

const refreshAccessToken = asyncHandler( async(req, res) =>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

if (!incomingRefreshToken) {
  throw new ApiError(401, "unauthorized request");
}

try {
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRETE
  )
  const user = await User.findById(decodedToken?._id)
  
  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token")
  }
  
  if (incomingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh Token Expired or Used")
  }
  
  const options = {
    httpOnly : true,
    secure : true
  }
  
  const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", newRefreshToken, options)
  .json(
    new apiResponse(
      200,
      {
        accessToken, refreshToken : newRefreshToken
      },
      "Access Token Refreshed"
    )
  )
  
} catch (error) {
  throw new ApiError(401,error?.message || "Invalid Refresh Token")
}
});

const changeCurrentPassword = asyncHandler( async(req, res) =>{
  const {oldPassword, newPassword} = req.body
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if(!isPasswordCorrect){
    throw new ApiError(
      400,"Invalid old Password"
    )
  }
  user.password = newPassword
  await save({validateBeforeSave : false})
  return res.
  status(200)
  .json(
    new apiResponse(
      200,
      {},
      "Password Updater Successfully"
    )
  )
});

const getCurrentUser = asyncHandler( async(req, res) =>{
  return res.
  status(200)
  .json( new apiResponse(
    200,
    req.user,
    "User Fetched Successfully"
  ))
});

const accountDetailsUpdate = asyncHandler( async(req, res) =>{
  const {fullName, email} = req.body
  if (!fullName || !email) {
   throw new ApiError(400,"All Feilds are required")
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set : {
        fullName,
        email : email
      }
    },
    {new : true}
  ).select("-password")
  return res.
  status(200)
  .json(
    200,
    user,
    "User Details Updated"
  )
});

const updateAvatarImage = asyncHandler( async(req, res) =>{
  avatarLocalPath = req.files?.path
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is Missing");
  }
  const avatar = uploadCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error while Uploding Avatar Image");
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set : {
        avatar : avatar.url
      }
    },
    {
      new : true
    }
  ).select("-password")

  return res.
  status(200)
  .json(new apiResponse(
    200,
    user,
    "Avatar Image Updated Successfully"
  ))
});

const updateCoverImage = asyncHandler( async(req, res) =>{
  const coverImageLocalPath = req.files?.path
  if(!coverImageLocalPath)
  {
    throw new ApiError(400, "Cover Image are Missing");
  }
  const coverImage = uploadCloudinary(coverImageLocalPath);
  if (!coverImage.url) {
    throw new ApiError(400, "Error While Uploading Cover Image");
  }
  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set : {
        coverImage : coverImage.url
      }
    },
    {new : true}
  ).select("-password")
  return res.
  status(200)
  .json(
    new apiResponse(
      200,
      user,
      "Cover Image Updated Successfully"
    )
  )
});

const getUserProfile = asyncHandler( async(req, res) =>{
  const {username} = req.params
  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = await User.aggregate([
    {
      $match : {
        username : username?.toLowerCase()
      }
    },
    {
      $lookup : {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers"
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          $cond: {
            if: {$in: [req.user?._id, "$subscribers.subscriber"]},
            then: true,
            else: false
          }
        } 
      }
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1
      }}
  ])
  
  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists")
  }
  return res
  .status(200)
  .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
  )


});

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})



export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  accountDetailsUpdate,
  updateAvatarImage,
  updateCoverImage,
  getUserProfile,
  getWatchHistory
}