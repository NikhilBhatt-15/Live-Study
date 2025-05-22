import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { exec } from "child_process";
import fs from "fs";
import { Channel } from "../models/channel.model.js";

async function generateThumbnail(videoPath, outputDir) {
    const thumbnailPath = `${outputDir}/thumbnail.jpg`;
    const command = `ffmpeg -i "${videoPath}" -ss 00:00:01.000 -vframes 1 "${thumbnailPath}"`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error generating thumbnail: ${error}`);
                reject(error);
            } else {
                console.log(`Thumbnail generated: ${thumbnailPath}`);
                resolve(thumbnailPath);
            }
        });
    });
}
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
const uploadVideo = asyncHandler(async (req, res) => {
    console.log(req.file);
    const { title, description } = req.body;
    if (!title || !description) {
        throw new ApiError(400, "Please provide title and description");
    }
    const channel = await Channel.findOne({ owner: req.user._id });
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }
    const channelId = channel._id;
    if (!req.file) {
        throw new ApiError(400, "Please upload a video");
    }
    const newVideo = await Video.create({
        title,
        description,
        channelId,
        videoUrl: "--",
    });
    if (!newVideo) {
        throw new ApiError(500, "Video not created");
    }
    const outputDir = `./public/uploads/${newVideo._id}`;
    const videoPath = req.file.path;
    const outputFilename = "index.m3u8";
    const outputPath = `${outputDir}/${outputFilename}`;

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const command = `ffmpeg -i "${videoPath}" \
        -map 0:v -c:v libx264 -crf 23 -preset medium -g 48 \
        -map 0:v -c:v libx264 -crf 28 -preset fast -g 48 \
        -map 0:v -c:v libx264 -crf 32 -preset fast -g 48 \
        -map 0:a -c:a aac -b:a 128k \
        -hls_time 10 -hls_playlist_type vod -hls_flags independent_segments -report \
        -f hls "${outputPath}"`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`ffmpeg exec error: ${error}`);
            if (!res.headersSent) {
                return res
                    .status(500)
                    .json(
                        new ApiResponse(500, null, "Video conversion failed")
                    );
            }
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`); // Store chapter information
    });
    const hlsUrl = `http://localhost:8000/uploads/${newVideo._id}/index.m3u8`;

    const thumbnailPath = await generateThumbnail(videoPath, outputDir);

    const thumbnailUrl = `http://localhost:8000/uploads/${newVideo._id}/thumbnail.jpg`;
    if (!thumbnailPath) {
        throw new ApiError(500, "Thumbnail generation failed");
    }
    const video = await Video.findByIdAndUpdate(
        newVideo._id,
        {
            $set: {
                videoUrl: hlsUrl,
                duration: 60,
                thumbnailUrl: thumbnailUrl,
            },
        },
        { new: true }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video uploaded successfully"));
});

export {
    getVideos,
    getVideoById,
    likeVideo,
    dislikeVideo,
    isVideoLiked,
    uploadVideo,
};
