import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model.js";
import { Livestream } from "./models/livestream.model.js";

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
                client.send(JSON.stringify(message));
            }
        });
    }
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
        timestamp: Date.now(),
    };
}

// WebSocket server setup
export const setupWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws, req) => {
        const { token, roomId } = url.parse(req.url, true).query;
        if (!token || !roomId) return ws.close();

        try {
            // Verify JWT
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(payload.id);
            // Validate livestream
            const livestream = await Livestream.findOne({ streamKey: roomId });
            if (!livestream || livestream.isEnded || !livestream.isLive) {
                return ws.close();
            }

            // Add to room
            if (!rooms[roomId]) rooms[roomId] = new Set();
            rooms[roomId].add(ws);

            // Store user and room ID on the connection
            ws.user = user;
            ws.roomId = roomId;

            // Message handler
            ws.on("message", async (data) => {
                try {
                    if (ws.user) {
                        const message = JSON.parse(data.toString());
                        if (!message.content?.trim()) return;

                        const chatMessage = formatMessage(
                            ws.user,
                            message.content
                        );
                        broadcastMessage(roomId, chatMessage);
                    }
                } catch (err) {
                    console.error("Message processing error:", err);
                }
            });

            // Cleanup on close
            ws.on("close", () => {
                if (rooms[roomId]) {
                    rooms[roomId].delete(ws);
                    if (rooms[roomId].size === 0) delete rooms[roomId];
                }
            });
        } catch (err) {
            console.error("WebSocket connection error:", err);
            ws.close();
        }
    });
};
