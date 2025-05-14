import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
const getVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({}).populate("channelId");
    if (!videos) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No videos found"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("channelId");
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    video.views += 1;
    await video.save();
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const likeVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const like = await Like.findOne({ videoId: id, userId: req.user.id });
    if (like) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Video already liked"));
    }
    const newLike = new Like({
        videoId: id,
        userId: req.user.id,
    });
    await newLike.save();
    video.likes += 1;
    await video.save();
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video liked successfully"));
});

const dislikeVideo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const like = await Like.findOne({ videoId: id, userId: req.user.id });
    if (!like) {
        return res
            .status(400)
            .json(new ApiResponse(400, null, "Video not liked yet"));
    }
    await Like.findByIdAndDelete(like._id);
    video.likes -= 1;
    await video.save();
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video disliked successfully"));
});

const isVideoLiked = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    const like = await Like.findOne({ videoId: id, userId: req.user.id });
    if (like) {
        return res
            .status(200)
            .json(new ApiResponse(200, true, "Video is liked"));
    }
    return res
        .status(200)
        .json(new ApiResponse(200, false, "Video is not liked"));
});

export { getVideos, getVideoById, likeVideo, dislikeVideo, isVideoLiked };
