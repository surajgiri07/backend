import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!(name && description)) {
        throw new ApiError(400, "All fields are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id,
        video: []
    })

    return res.status(200)
        .json(new ApiResponse(200, playlist, "playlist created successfully"))
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "User id is required")
    }

    const playlist = await Playlist.find({
        owner: userId
    })

    if (!playlist) {
        throw new ApiError(404, "user not found")
    }

    return res.status(200).
        json(new ApiResponse(200, playlist, "user playlist found successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "playlist not found ")
    }

    return res.status(200)
        .json(new ApiResponse(200, playlist, "playlist found successfully"))
    //TODO: get playlist by id


})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required")
    }

    if (!videoId) {
        throw new ApiError(400, "video id is required")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $push:{
        video: videoId
        }
    },{
        new:true,
    })

    return res.status(200)
        .json(new ApiResponse(200, playlist, "video added successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required")
    }

    if (!videoId) {
        throw new ApiError(400, "video id is required")
    }

    const playlist=await Playlist.findByOneAndUpdate({
        _id:playlistId,
        video:videoId
    },{
        $pull:{
           video:videoId
        }
    },{
        new:true
    })

    return res.status(200)
    .json(new ApiResponse(200,playlist,"video deleted successfully"))
    
    // TODO: remove video from playlist


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required")
    }

    await Playlist.findByOneAndDelete({
        _id:playlistId,
        owner:req.user._id
    })

    return res.status(200)
        .json(new ApiResponse(200, {}, "playlist removed successfully"))
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!playlistId) {
        throw new ApiError(400, "playlist id is required")
    }

    if (!(name && description)) {
        throw new ApiError(400, "All fields are required")
    }

    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name: name,
            description: description
        }

    }, {
        new: true
    }
    )

    return res.status(200).
    json(new ApiResponse(200,playlist,"playlist updated successfully"))

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}