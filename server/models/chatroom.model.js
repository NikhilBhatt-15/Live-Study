import mongoose from "mongoose";
const chatroomSchema = new mongoose.Schema({
  streamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Livestream",
    required: true,
  },
  messages: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: String,
      sentAt: { type: Date, default: Date.now },
    },
  ],
});

export const Chatroom = mongoose.model("Chatroom", chatroomSchema);
