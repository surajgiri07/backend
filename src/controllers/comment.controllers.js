import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

})

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { videoId } = req.params

    if (!content) {
        throw new ApiError(400, "comment is required")
    }

    if (!videoId) {
        throw new ApiError(400, "video is required")
    }


    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "video not found")
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res.status(200).json(new ApiResponse(200, comment, "comment added successfully"))

    // TODO: add a comment to a video
})

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body
   // const { videoId } = req.params
    const{commentId}=req.params

    if (!content) {
        throw new ApiError(400, "comment is required")
    }

    if (!commentId) {
        throw new ApiError(400, "commentId is required")
    }

    // const video = await Video.findById(videoId)

    // if (!video) {
    //     throw new ApiError(404, "video not found")
    // }

    const comment = await Comment.findOneAndUpdate({
        _id: commentId,
        owner: req.user._id
    }, 
    {
        $set: {
            content: content
        }
    }, 
    {
        new: true,
    })

    return res.status(200).
        json(new ApiError(200, comment, "comment updated successfully"))
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!commentId) {
        throw new ApiError(400, "commentId is required")
    }

    // const video = await Video.findById(videoId)

    // if (!video) {
    //     throw new ApiError(404, "video not found")
    // }

    const comment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user._id
    })

    return res.status(200).
    json(new ApiResponse(200, {}, "comment deleted successfully"))
    // TODO: delete a comment
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}