import { asyncHandler } from "../utils/asyncHandler.js";
import { Livestream } from "../models/livestream.model.js";
import { ApiError } from "../utils/apiError.js";
import { Channel } from "../models/channel.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

async function getHlsDuration(hlsUrl) {
    const res = await fetch(hlsUrl);
    if (!res.ok) throw new Error("Failed to fetch HLS playlist");
    const playlist = await res.text();
    const matches = playlist.match(/#EXTINF:([\d.]+)/g);
    const total = matches
        ? matches
              .map((x) => parseFloat(x.split(":")[1]))
              .reduce((a, b) => a + b, 0)
        : 0;
    return total; // in seconds
}

const golive = asyncHandler(async (req, res) => {
    const { title, description, tags } = req.body;
    if ([title, description].some((item) => item?.trim() === "")) {
        throw new ApiError(400, "Please fill all the fields");
    }
    const channel = await Channel.findOne({
        owner: req.user._id,
    });
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const livestream = await Livestream.create({
        channelId: channel._id,
        title,
        description,
        thumbnailUrl: `https://placehold.co/100/F59E0B/FFFFFF/png?text=${title}`,
        tags: tags,
    });

    if (!livestream) {
        throw new ApiError(500, "Failed to create livestream");
    }
    const streamKey = `${channel._id}-${livestream._id}`;
    const updatedLivestream = await Livestream.findByIdAndUpdate(
        livestream._id,
        {
            $set: {
                streamKey,
                rtmpUrl: `rtmp://localhost:1935/live/${streamKey}`,
                hlsUrl: `http://localhost:8080/hls/${streamKey}/index.m3u8`,
            },
        },
        { new: true }
    );

    if (!updatedLivestream) {
        throw new ApiError(500, "Failed to update livestream");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                streamKey: updatedLivestream.streamKey,
                rtmpUrl: updatedLivestream.rtmpUrl,
                hlsUrl: updatedLivestream.hlsUrl,
                title: updatedLivestream.title,
                description: updatedLivestream.description,
                thumbnailUrl: updatedLivestream.thumbnailUrl,
                tags: updatedLivestream.tags,
                channelId: updatedLivestream.channelId,
                channelName: channel.name,
                channelAvatar: channel.avatarUrl,
            },
            "Livestream created successfully"
        )
    );
});

const endLiveStream = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const streamKey = name;
    if (!streamKey) {
        throw new ApiError(400, "Please provide stream key");
    }
    const livestream = await Livestream.findOne({
        streamKey: streamKey,
    });
    if (!livestream) {
        throw new ApiError(404, "Livestream not found");
    }
    if (livestream.isEnded) {
        throw new ApiError(400, "Livestream already ended");
    }
    const updatedLivestream = await Livestream.findByIdAndUpdate(
        livestream._id,
        {
            $set: {
                islive: false,
                isEnded: true,
                endedAt: Date.now(),
            },
        },
        { new: true }
    );
    if (!updatedLivestream) {
        throw new ApiError(500, "Failed to end livestream");
    }
    const duration = await getHlsDuration(livestream.hlsUrl);
    const video = await Video.create({
        channelId: livestream.channelId,
        title: livestream.title,
        description: livestream.description,
        thumbnailUrl: livestream.thumbnailUrl,
        tags: livestream.tags,
        isPublic: true,
        videoUrl: livestream.hlsUrl,
        isLiveRecording: true,
        duration: duration,
        publishedAt: livestream.startedAt,
    });
    if (!video) {
        throw new ApiError(500, "Failed to create video");
    }
    const updatedLivestreamWithVideo = await Livestream.findByIdAndUpdate(
        livestream._id,
        {
            $set: {
                recordingId: video._id,
            },
        },
        { new: true }
    );
    if (!updatedLivestreamWithVideo) {
        throw new ApiError(500, "Failed to update livestream");
    }
    console.log("Livestream ended");
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Livestream ended successfully"));
});

const startLiveStream = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const streamKey = name;
    if (!streamKey) {
        throw new ApiError(400, "Please provide stream key");
    }
    const livestream = await Livestream.findOne({
        streamKey: streamKey,
    });
    if (!livestream) {
        throw new ApiError(404, "Livestream not found");
    }
    if (livestream.islive) {
        throw new ApiError(400, "Livestream already started");
    }
    if (livestream.isEnded) {
        throw new ApiError(400, "Livestream already ended");
    }
    const updatedLivestream = await Livestream.findByIdAndUpdate(
        livestream._id,
        {
            $set: {
                islive: true,
                isEnded: false,
                isPublic: true,
                startedAt: Date.now(),
            },
        },
        { new: true }
    );
    if (!updatedLivestream) {
        throw new ApiError(500, "Failed to start livestream");
    }
    console.log("Livestream started");
    return res
        .status(200)
        .json(new ApiResponse(200, null, "Livestream started successfully"));
});

const getLiveStream = asyncHandler(async (req, res) => {
    const { streamKey } = req.body;
    if (!streamKey) {
        throw new ApiError(400, "Please provide stream key");
    }
    const livestream = await Livestream.findOne({
        streamKey: streamKey,
    });
    if (!livestream) {
        throw new ApiError(404, "Livestream not found");
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                streamKey: livestream.streamKey,
                rtmpUrl: livestream.rtmpUrl,
                hlsUrl: livestream.hlsUrl,
                title: livestream.title,
                description: livestream.description,
                thumbnailUrl: livestream.thumbnailUrl,
                tags: livestream.tags,
                channelId: livestream.channelId,
                isEnded: livestream.isEnded,
                isLive: livestream.islive,
            },
            "Livestream fetched successfully"
        )
    );
});

const getOnGoingLiveStream = asyncHandler(async (req, res) => {
    const channel = await Channel.findOne({
        owner: req.user._id,
    });
    if (!channel) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "Channel not found"));
    }
    const livestream = await Livestream.findOne({
        isEnded: false,
        channelId: channel._id,
    });
    if (!livestream) {
        return res
            .status(404)
            .json(new ApiResponse(404, null, "No ongoing livestream found"));
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                streamKey: livestream.streamKey,
                rtmpUrl: livestream.rtmpUrl,
                hlsUrl: livestream.hlsUrl,
                title: livestream.title,
                description: livestream.description,
                thumbnailUrl: livestream.thumbnailUrl,
                tags: livestream.tags,
                channelId: livestream.channelId,
                isEnded: livestream.isEnded,
                isLive: livestream.islive,
            },
            "Ongoing Livestream fetched successfully"
        )
    );
});

export {
    golive,
    endLiveStream,
    startLiveStream,
    getLiveStream,
    getOnGoingLiveStream,
};
