import { asyncHandler } from "../utilis/asyncHandler.js";
import { ApiError } from "../utilis/ApiError.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utilis/cloudinary.js"
import { ApiResponse } from "../utilis/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, 'something went wrong while generating access and refresh tokens')
  }
}
//register
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  // console.log("email :", email)

  if ([fullName, email, username, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "user with this username and email is already exists");
  }



  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImagePath = req.files?.coverImage[0]?.path;
  let coverImagePath;
  if (req.files && Array.isArray(req.files.coverImage)
    && req.files.coverImage.length > 0) {
    coverImagePath = req.files.coverImage[0].path
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatarpath is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImagePath);


  if (!avatar) {
    throw new ApiError(400, "avatar is required");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "user registeration successfull")
  )

})

//login
const loginUser = asyncHandler(async (req, res) => {

  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { username, email, password } = req.body

  if (!(username || email)) {
    throw new ApiError(400, "username and email fields should be filled")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect")
  }

  const { accessToken, refreshToken } = await
    generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200,
        {
          user: loggedInUser, refreshToken, accessToken
        },
        "User logged in successfully")
    )

});

//logout user
const loggedOutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: undefined
    },

  }, {
    new: true
  })

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options).json(
      new ApiResponse(200, {}, "User loggedout Successfully")
    )
});

const refreshAccessToken = await asyncHandler(async (req, res) => {

  const incomingRefreshToken = req.cokkies.refreshToken || req.bpdy.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Unauthorized Request")
  }

  try {
    const decodedRefreshToken = jwt.verify(incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedRefreshToken._id)

    if (!user) {
      throw new ApiError(400, "Invalid refreshtoken")
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      throw new ApiError(400, "Invalid refreshtoken")
    }

    const options = {
      httpOnly: true,
      secure: true,
    }

    const { accessToken, newRefershToken } = generateAccessAndRefreshTokens(user._id)

    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken },
        "accesstoken refershed"))


  } catch (error) {
    throw new ApiError(404, error?.message, "invalid refersh token")
  }
})

const changePassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword, confirmPassword } = req.body

  if (!(newPassword === confirmPassword)) {
    throw new ApiError(400, "the passwords doesnot matched")
  }

  const user = await User.findById(req.user?._id)

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid Password")
  }

  user.password = newPassword
  user.save({ validateBeforeSave: false })

  return res.status(200).
    json(new ApiResponse(200, {}, "password changed successfully"))


})

const currentUser = asyncHandler(async (req, res) => {
  return res.status(200).
    json(new ApiResponse(200, req.user, "user fetched successfully"))
})

const updateAccountdetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body


  if (!fullName || !email) {
    throw new ApiError(400, "All fileds are required")
  }

  const user = await User.findByIdAndUpdate(req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email
      }
    },
    { new: true }).select("-password")

  return res.status(200).
    json(new ApiResponse(200, user, "account details are successsfully changed"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar[0].path

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar is required')
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400, 'Avatar is required')
  }

  const user = await User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }).select("-password")

  return res.status(200).
    json(new ApiResponse(200, user, "avatar updated successfully"))
})

const updateUsercoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage[0].path

  if (!coverImageLocalPath) {
    throw new ApiError(400, 'cover Image is required')
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if (!coverImage.url) {
    throw new ApiError(400, 'cover Image is required')
  }

  const user = await User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    { new: true }).select("-password")

  return res.status(200).
    json(new ApiResponse(200, user, "coverImage updated successfully"))
})

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username) {
    throw new ApiError(400, "username is missing")
  }

 const channel= await User.aggregate([
    {
      $match: {
        username:username
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    }, {
      $addFields: {

        subscriberCount: {
          $size: "$subscribers"
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribedTo: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
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
        subscriberCount: 1,
        channelSubscribedToCount: 1,
        isSubscribedTo: 1,
        avatar: 1,
        coverImage: 1,
        email: 1

      }

    }

  ])

  if (!channel?.length) {
    throw new ApiError(400,"channel doesnot exists")
  }

  return res.status(200).
  json(new ApiResponse(200,channel[0]),"User channel fetched successfully")
})
export {
  registerUser,
  loginUser,
  loggedOutUser,
  refreshAccessToken,
  changePassword,
  currentUser,
  updateAccountdetails,
  updateUserAvatar,
  updateUsercoverImage,
  getUserChannelProfile
};