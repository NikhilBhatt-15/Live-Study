import mongoose from "mongoose";
import AaggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema(
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
        videoUrl: {
            type: String,
            required: true,
        },
        isLiveRecording: {
            type: Boolean,
            default: false,
        },
        duration: {
            type: Number,
        },
        tags: {
            type: [String],
        },
        views: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        dislikes: {
            type: Number,
            default: 0,
        },
        notes: [
            {
                title: String,
                description: String,
                fileUrl: String,
                uploadedAt: Date,
            },
        ],
        publishedAt: {
            type: Date,
            default: Date.now,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

videoSchema.plugin(AaggregatePaginate);
export const Video = mongoose.model("Video", videoSchema);
