import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import url from "url";
import { v4 as uuidv4 } from "uuidv4";
import cors from "cors";
import auth from "./routes/auth.js";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(auth);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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
