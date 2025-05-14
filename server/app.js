import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(
    cors({
        origin: true,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// for Render reloading
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: "Welcome to the Livestudy API",
        data: null,
    });
});

import userRoutes from "./routes/user.routes.js";
import livestreamRoutes from "./routes/livestream.routes.js";
import videoRoutes from "./routes/video.routes.js";
import channelRoutes from "./routes/channel.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/users", livestreamRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/channels", channelRoutes);

export default app;
