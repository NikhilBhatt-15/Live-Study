import { Channel } from "../models/channel.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/like.model.js";
import { Subscription } from "../models/subscription.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

const getOwnChannelProfile = asyncHandler(async (req, res) => {
    const channel = await Channel.findOne({ owner: req.user._id }).populate(
        "owner",
        "-password"
    );
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const subscribers = await Subscription.find({
        channelId: channel._id,
    }).populate("userId", "-password");
    const subscribersCount = subscribers.length;
    const videos = await Video.find({
        channelId: channel._id,
    });
    const videosCount = videos.length;
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                channel,
                subscribersCount,
                videosCount,
                videos,
            },
            "Channel profile fetched successfully"
        )
    );
});

const subscribeToChannel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const channel = await Channel.findById(id);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const subscription = await Subscription.findOne({
        channelId: id,
        subscriberId: req.user._id,
    });
    if (subscription) {
        throw new ApiError(400, "Already subscribed to this channel");
    }
    const newSubscription = await Subscription.create({
        channelId: id,
        subscriberId: req.user._id,
    });
    if (!newSubscription) {
        throw new ApiError(500, "Failed to subscribe to channel");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Subscribed to channel successfully"));
});

const unsubscribeFromChannel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const channel = await Channel.findById(id);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const subscription = await Subscription.findOne({
        channelId: id,
        subscriberId: req.user._id,
    });
    if (!subscription) {
        throw new ApiError(400, "Not subscribed to this channel");
    }
    await Subscription.findByIdAndDelete(subscription._id);
    await channel.save();
    return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Unsubscribed from channel successfully")
        );
});
const getOwnSubscribers = asyncHandler(async (req, res) => {
    const channel = await Channel.findOne({ owner: req.user._id });
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const subscribers = await Subscription.find({
        channelId: channel._id,
    }).populate("userId", "-password");
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Subscribers fetched successfully"
            )
        );
});

const getChannelinfo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const channel = await Channel.findById(id).populate("owner", "-password");
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const subscribers = await Subscription.find({
        channelId: channel._id,
    });
    const subscribersCount = subscribers.length;
    channel.subscribersCount = subscribersCount;
    return res
        .status(200)
        .json(
            new ApiResponse(200, channel, "Channel info fetched successfully")
        );
});

const isSubscribed = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const channel = await Channel.findById(id).populate("owner", "-password");
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const isSubscribed = await Subscription.findOne({
        channelId: channel._id,
        subscriberId: req.user._id,
    });
    if (isSubscribed) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, true, "User is subscribed to the channel")
            );
    } else {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    false,
                    "User is not subscribed to the channel"
                )
            );
    }
});
//   TODO: make it so that it only returns the channel is subscribed or not
const getChannelVideos = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const channel = await Channel.findById(id).populate("owner", "-password");
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const videos = await Channel.find({
        channelId: channel._id,
    }).populate("channelId");
    return res
        .status(200)
        .json(
            new ApiResponse(200, videos, "Channel videos fetched successfully")
        );
});
export {
    getOwnChannelProfile,
    subscribeToChannel,
    unsubscribeFromChannel,
    getOwnSubscribers,
    getChannelinfo,
    getChannelVideos,
    isSubscribed,
};
