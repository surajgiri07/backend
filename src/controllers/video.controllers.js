import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"



const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!(title && description)) {
        throw new ApiError(400, "tittle and descriptions are required")
    }
    const videoPath = req.files?.videoFile[0]?.path
    const thumbnailPath = req.files?.thumbnail[0]?.path

    if (!videoPath) {
        throw new ApiError(400, "video is required")
    }

    const videoFile = await uploadOnCloudinary(videoPath)

    if (!videoFile) {
        throw new ApiError(400, "video is required")
    }

    if (!thumbnailPath) {
        throw new ApiError(400, "thumbnail is required")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!thumbnail) {
        throw new ApiError(400, "thumbnail is required")
    }

    const owner = req.user._id
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        owner,
        thumbnail:thumbnail.url

    })

    return res.status(200).
        json(ApiResponse(200, video, "video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new ApiError(400, "videoId is required")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "videoId isa invalid")

    }
    return res.status(200).
        json(new ApiResponse(200, "video found by the help of id"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400,"video is requird")
    }

    await Video.findByIdAndDelete(videoId)
  
    //TODO: delete video

    return res.status(200).json(new ApiResponse(200,{}, "video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!videoId){
        throw new ApiError(400,"video is required")
    }

   const videoStatus= await Video.create({
    isPublished,
    })
/// here.................
 const togggleStatus=await videoStatus.find
    if(!video){
        throw new ApiError(400,"video isnot published")
    }

return res.status(200).json(new ApiResponse(200,video,"video ps published "))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}