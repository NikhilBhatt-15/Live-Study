import { Router } from "express";
import {
    getVideoById,
    getVideos,
    likeVideo,
    dislikeVideo,
    isVideoLiked,
    uploadVideo,
} from "../controllers/video.controller.js";
import { upload2 } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/like/:id", verifyJwt, likeVideo);
router.post("/dislike/:id", verifyJwt, dislikeVideo);
router.get("/isLiked/:id", verifyJwt, isVideoLiked);
router.post("/upload", upload2.single("video"), verifyJwt, uploadVideo);

export default router;
