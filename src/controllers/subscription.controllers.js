import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!channelId) {
        throw new ApiError(400, "Channel Id is missing")
    }

    const channel = await User.findById(channelId)
    if (!channel) {
        throw new ApiError(404, "channel not found")
    }
    const subscription = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id
    })
 let isSubscribed

    if (!subscription) {
        await Subscription.create({
            subscriber: req.user._id,
            channel: channelId,
        })

         isSubscribed=true
    } else {
        await subscription.deleteOne()
        isSubscribed=false
    }

    return res.status(200).
        json(new ApiResponse(200, isSubscribed, "subscription toggled successfully"))
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}