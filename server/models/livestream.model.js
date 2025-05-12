import mongoose from "mongoose";

const livestreamSchema = new mongoose.Schema(
    {
        channelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        thumbnailUrl: {
            type: String,
        },
        islive: {
            type: Boolean,
            default: false,
        },
        isEnded: {
            type: Boolean,
            default: false,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        hlsUrl: {
            type: String,
        },
        rtmpUrl: {
            type: String,
        },
        streamKey: {
            type: String,
        },
        tags: {
            type: [String],
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        endedAt: {
            type: Date,
        },
        likes: {
            type: Number,
            default: 0,
        },
        recordingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        notes: [
            {
                title: String,
                fileUrl: String,
                uploadedAt: Date,
            },
        ],
        chatRoomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatRoom",
        },
    },
    { timestamps: true }
);

export const Livestream = mongoose.model("Livestream", livestreamSchema);
