import app from "./app.js";
import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import { v4 as uuidv4 } from "uuid";
import { configDotenv } from "dotenv";
import connectDB from "./database/index.js";

configDotenv({
    path: "./.env",
});
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

const connectedClients = {};
const clients = [];

const wss = new WebSocketServer({ server });

const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString());
    const { type, data } = message;
    broadcastMessage(message);
};

const broadcastMessage = (message) => {
    Object.keys(connectedClients).forEach((uuid) => {
        const client = connectedClients[uuid];
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

const onClose = (uuid) => {
    console.log(`Client disconnected: ${uuid}`);
    delete connectedClients[uuid];
    delete clients[uuid];
};

wss.on("connection", (ws, req) => {
    const { username } = url.parse(req.url, true).query;
    const uuid = uuidv4();
    connectedClients[uuid] = ws;
    clients[uuid] = {
        username,
    };
    console.log(`Client connected: ${username}`);

    ws.on("message", handleMessage(message, uuid));
    ws.on("close", onClose(uuid));
});
