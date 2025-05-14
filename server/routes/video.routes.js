import { Router } from "express";
import {
    getVideoById,
    getVideos,
    likeVideo,
    dislikeVideo,
    isVideoLiked,
} from "../controllers/video.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/like/:id", verifyJwt, likeVideo);
router.post("/dislike/:id", verifyJwt, dislikeVideo);
router.get("/isLiked/:id", verifyJwt, isVideoLiked);

export default router;
