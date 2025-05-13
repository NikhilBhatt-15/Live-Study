import app from "./app.js";
import { setupWebSocketServer } from "./wsServer.js";
import { configDotenv } from "dotenv";
import connectDB from "./database/index.js";

configDotenv({
    path: "./.env",
});
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

setupWebSocketServer(server);
