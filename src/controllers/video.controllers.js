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

        videoFile: {
            url: videoFile.url,
            public_id: videoFile.public_id
        },

        owner: req.user,

        thumbnail: {
            url: thumbnail.url,
            public_id: thumbnail.public_id

        }
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

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    // First check video exists and belongs to logged-in user
    const video = await Video.findOne({
        _id: videoId,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(404, "Video not found or you are not authorized")
    }

    const { title, description } = req.body




    const thumbnailPath = req.file?.path

    if (thumbnailPath) {
        const thumbnail = await uploadOnCloudinary(thumbnailPath)

        if (!thumbnail?.url) {
            throw new ApiError(400, "Error while uploading thumbnail")
        }

    }


    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title: title || video.title,
                description: description || video.description,
                thumbnail: thumbnail.url
            }
        },
        {
            new: true
        }
    )


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedVideo,
                "Video updated successfully"
            )
        )
})

const deleteVideo = asyncHandler(async (req, res) => { 
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video Id is required")
    }

    const video = await Video.findById(
        {
            _id: videoId,
            owner: req.user
        })

    if (!video) {
        throw new ApiError(400, "video not found or you are an unauthorized user")
    }

    await cloudinary.uploader.destroy(video.videoFile.public_id, {
        resource_type: 'video'
    })

    await cloudinary.uploader.destroy(video.thumbnail.public_id)

    await Video.findByIdAndDelete(videoId)

    return res.status(200)
        .json(new ApiResponse(200, 'Video is deleted successfully'))

})


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "video is required")
    }


    const video = await Video.findOne({
        _id: videoId,
        owner: req.user._id
    })

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublished = !video.isPublished

    await video.save()



    return res.status(200).
        json(new ApiResponse(200, video, "video status is toggled successfuly"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}