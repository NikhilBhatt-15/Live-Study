import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model.js";
import { Livestream } from "./models/livestream.model.js";
import { Chatroom } from "./models/chatroom.model.js";

export const rooms = {}; // { [roomId: string]: Set<WebSocket> }

// Room management functions
export function createRoom(streamKey) {
    if (!rooms[streamKey]) rooms[streamKey] = new Set();
}

export function destroyRoom(streamKey) {
    if (rooms[streamKey]) {
        rooms[streamKey].forEach((ws) => ws.close());
        delete rooms[streamKey];
    }
}

// Message handling
function broadcastMessage(roomId, message) {
    if (rooms[roomId]) {
        rooms[roomId].forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                try {
                    client.send(JSON.stringify(message));
                } catch (err) {
                    console.error("Error broadcasting message:", err);
                }
            }
        });
    }
}
function timestamp() {
    const date = new Date();
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}
function formatMessage(user, content) {
    return {
        user: {
            _id: user._id,
            username: user.name,
            avatar: user.avatarUrl,
            email: user.email,
        },
        content,
        timestamp: timestamp(),
    };
}

// WebSocket server setup
export const setupWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws, req) => {
        try {
            const { token, roomId } = url.parse(req.url, true).query;
            if (!roomId) {
                console.error("Missing roomId");
                return ws.close(); // roomId is always required
            }

            let user = null;
            if (token) {
                try {
                    const payload = jwt.verify(
                        token,
                        process.env.ACCESS_TOKEN_SECRET
                    );
                    user = await User.findById(payload.id);
                } catch (err) {
                    console.error("Invalid token:", err);
                    // Invalid token, user remains null
                }
            }

            // Validate livestream
            let myChatroom;
            try {
                myChatroom = await Chatroom.findById(roomId);
                if (!myChatroom) {
                    console.error("Chatroom not found");
                    return ws.close(); // Invalid livestream ID
                }
            } catch (err) {
                console.error("Error fetching chatroom:", err);
                return ws.close();
            }

            let myLiveStream;
            try {
                myLiveStream = await Livestream.findById(myChatroom.streamId);
                if (!myLiveStream) {
                    console.error("Livestream not found");
                    return ws.close(); // Invalid livestream ID
                }
                if (myLiveStream.isLive === false) {
                    console.error("Livestream is not live");
                    return ws.close(); // Livestream is not live
                }
                if (myLiveStream.isEnded === true) {
                    console.error("Livestream is deleted");
                    return ws.close(); // Livestream is deleted
                }
            } catch (err) {
                console.error("Error fetching livestream:", err);
                return ws.close();
            }

            // Add to room
            if (!rooms[roomId]) {
                console.error("Room does not exist");
                createRoom(roomId);
                console.log("Creating new room:", roomId);
            }
            rooms[roomId].add(ws);

            ws.user = user; // may be null
            ws.roomId = roomId;

            // Message handler
            ws.on("message", async (data) => {
                try {
                    // Only allow sending if authenticated
                    if (ws.user) {
                        const message = JSON.parse(data.toString());
                        if (!message.content?.trim()) return;
                        const chatMessage = formatMessage(
                            ws.user,
                            message.content
                        );
                        broadcastMessage(roomId, chatMessage);
                    } else {
                        ws.send(
                            JSON.stringify({
                                error: "Authentication required to send messages.",
                            })
                        );
                    }
                } catch (err) {
                    console.error("Error handling message:", err);
                    ws.send(
                        JSON.stringify({ error: "Invalid message format" })
                    );
                }
            });

            ws.on("close", () => {
                try {
                    if (rooms[roomId]) {
                        rooms[roomId].delete(ws);
                    }
                } catch (err) {
                    console.error("Error handling WebSocket close:", err);
                }
            });
        } catch (err) {
            console.error("Error during WebSocket connection setup:", err);
            ws.close();
        }
    });
};
