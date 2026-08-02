import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const{content}=req.body
    const{owner}=req.user._id

    if(!content){
        throw new ApiError(400,"contents cannot be empty ")
    }

    const tweet=await Tweet.create({
        content,
        owner
    })

    return res.status(200).
    json(new ApiResponse(200,tweet,"tweet is created successfully"))
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
    
})

const updateTweet = asyncHandler(async (req, res) => {
    const{tweetId}=req.params
    const{content}=req.body

    if (!tweetId) {
        throw new ApiError(400,"tweet id is missing")
    }
    if (!content) {
        throw new ApiError(400,"content is missing")
    }

    const tweet=await Tweet.findOneAndUpdate({
        _id:tweetId,
        owner:user.req._id
    },{
        $set:{
            content,
        }
    },{
        new:true
    })

    return res.status(200)
    .json(new ApiResponse(200,tweet,"Tweet is updated successfully"))
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    const{tweetId}=req.params

     if (!tweetId) {
        throw new ApiError(400,"tweet id is missing")
    }

    await Tweet.findOneAndDelete({
        _id:tweetId,
        owner:req.user
    })

return res.staus(200).json(new ApiResponse(200,"tweet deleted successfully"))
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}